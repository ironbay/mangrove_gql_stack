import { Config } from "@serverless-stack/node/config";
import { Entity } from "dynamodb-onetable";
import { Context } from "../context";
import { EventBridge } from "aws-sdk";

import {
  Configuration as PlaidConfig,
  PlaidApi,
  PlaidEnvironments,
  CountryCode as PlaidCountryCodes,
  Products as PlaidProducts,
} from "plaid";

import { Dynamo } from "@mangrove/core/dynamo";
import { cursorPaginationEnabledMethods } from "@slack/web-api";
import { builtinModules } from "module";

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

export async function get(ctx: Context, id: string) {
  const item = await PlaidConnection.get({ user, id })!;

  return {
    id: item!.id,
    kind: "plaid",
    institution: item?.institution,
    accounts: await accounts(item!.token),
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
