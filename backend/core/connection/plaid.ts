import { Config } from "@serverless-stack/node/config";
import { Entity } from "dynamodb-onetable";
import { Context } from "../context";
import { ApiGatewayManagementApi, EventBridge } from "aws-sdk";
import { DateTime } from "luxon";
import { Bus } from "@mangrove/core/bus";

import {
  Configuration as PlaidConfig,
  PlaidApi,
  PlaidEnvironments,
  CountryCode as PlaidCountryCodes,
  Products as PlaidProducts,
  Transaction as PlaidTransaction,
} from "plaid";

declare module "@mangrove/core/bus" {
  export interface Events {
    "plaid.hook": {
      id: string;
      user: string;
      item: string;
      type: string;
    };
    "plaid.tx.new": {
      id: string;
      account_id: string;
      amount: number;
      name: string;
      merchant_name?: string | null;
    };
  }
}

import { Dynamo } from "@mangrove/core/dynamo";
import { stringify } from "querystring";
import { tx_new } from "functions/plaid/events";

const plaid_config = new PlaidConfig({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": Config.PLAID_CLIENT_ID,
      "PLAID-SECRET": Config.PLAID_SECRET,
    },
  },
});

const api = new PlaidApi(plaid_config);

type PlaidConnection = Entity<typeof Dynamo.Schema.models.PlaidConnection>;
const PlaidConnection =
  Dynamo.Table.getModel<PlaidConnection>("PlaidConnection");

const PlaidTransaction =
  Dynamo.Table.getModel<Entity<typeof Dynamo.Schema.models.PlaidTransaction>>(
    "PlaidTransaction"
  );

export async function start_auth(user: string) {
  const resp = await api.linkTokenCreate({
    language: "en",
    client_name: "mangrove",
    country_codes: [PlaidCountryCodes.Us],
    user: {
      client_user_id: user,
    },
    products: [PlaidProducts.Transactions],
  });

  return resp.data.link_token;
}

export async function finish_auth(user: string, public_token: string) {
  const resp = await api.itemPublicTokenExchange({ public_token });
  const { access_token, item_id } = resp.data;

  const item_info = await api.itemGet({
    access_token,
    client_id: Config.PLAID_CLIENT_ID,
  })!;

  const conn: PlaidConnection = {
    type: "plaid_connection",
    id: item_id,
    user: user,
    token: access_token,
    institution: item_info.data.item.institution_id!,
  };

  await PlaidConnection.create(conn);
  return item_id;
}

export async function remove(ctx: Context, id: string) {
  const user = ctx.assertAuthenticated();
  const item = await PlaidConnection.get({ user: user.id, id });
  const connection = await get(ctx, id);

  await api.itemAccessTokenInvalidate({ access_token: item!.token });
  await PlaidConnection.remove({ id: item!.id });

  return connection;
}

export async function connections(user: string) {
  const items = await PlaidConnection.find({ user });

  const conns = await Promise.all(
    items.map(async (item) => {
      const info = await api.itemGet({ access_token: item.token });
      const inst = await api.institutionsGetById({
        client_id: Config.PLAID_CLIENT_ID,
        institution_id: info.data.item.institution_id!,
        country_codes: [PlaidCountryCodes.Us],
      });

      return {
        id: item.id,
        kind: "plaid",
        institution: inst.data.institution.name,
        accounts: await accounts(item.token),
      };
    })
  );

  return conns;
}

export async function fromID(user: string, id: string) {
  const item = await PlaidConnection.get({ user, id })!;

  return {
    id: item!.id,
    kind: "plaid",
    institution: item!.institution,
    accounts: await accounts(item!.token),
    access_token: item!.token,
  };
}

async function accounts(token: string) {
  const resp = await api.accountsGet({ access_token: token });

  return resp.data.accounts.map((acct) => ({
    id: acct.account_id,
    name: acct.name,
    category: acct.type,
    subcategory: acct.subtype,
  }));
}

export async function account_info(user: string, conn: string, id: string) {
  const item = await PlaidConnection.get({ user: user, id: conn })!;
  const resp = await api.accountsGet({ access_token: item!.token });
  const account = resp.data.accounts.find((acct) => acct.account_id === id);

  return {
    id: account?.account_id,
    name: account?.name,
    kind: account?.type,
    subkind: account?.subtype,
  };
}

type Webhook = {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
};

export async function hook(webhook: Webhook) {
  if (webhook.webhook_type !== "TRANSACTIONS") return;

  const bus = new EventBridge();

  bus.putEvents({
    Entries: [
      {
        Source: "mangrove.plaid",
        DetailType: "hook",
        Detail: JSON.stringify(webhook),
      },
    ],
  });
}

async function transactions(user: string, conn: string) {
  return PlaidTransaction.find({ user, conn });
}

export async function sync(user: string, item: string) {
  const conn = await fromID(user, item);

  const start = DateTime.now().minus({ days: 7 }).toFormat("yyyy-MM-dd");
  const end = DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd");

  async function fetch(offset = 0): Promise<PlaidTransaction[]> {
    const resp = await api.transactionsGet({
      access_token: conn.access_token,
      start_date: start,
      end_date: end,
      options: {
        offset,
      },
    });

    if (resp.data.transactions.length < resp.data.total_transactions) {
      return [
        ...resp.data.transactions,
        ...(await fetch(offset + resp.data.transactions.length)),
      ];
    }
    return resp.data.transactions;
  }

  const [existing, next] = await Promise.all([
    transactions(user, item),
    fetch(),
  ]);

  const existing_map = existing.reduce((coll, tx) => {
    coll[tx.id] = true;
    return coll;
  }, {} as Record<string, boolean>);

  const diff = next.filter((tx) => !existing_map[tx.transaction_id]);

  const dynamo_write = Promise.all(
    diff.map((tx) =>
      PlaidTransaction.create({
        user,
        type: "plaid_tx",
        id: tx.transaction_id,
        conn: item,
        account: tx.account_id,
        date: tx.date,
        data: tx,
      })
    )
  );

  const bus_publish = Promise.all(
    diff.map((d) =>
      Bus.publish("plaid.tx.new", {
        id: d.transaction_id,
        account_id: d.account_id,
        amount: d.amount,
        name: d.name,
        merchant_name: d.merchant_name,
      })
    )
  );

  await Promise.all([dynamo_write, bus_publish]);
}
