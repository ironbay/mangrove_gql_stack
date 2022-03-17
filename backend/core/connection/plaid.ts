import { Config } from "@serverless-stack/node/config";
import { Entity, Model, Table } from "dynamodb-onetable";

import {
  Configuration as PlaidConfig,
  PlaidApi,
  PlaidEnvironments,
  CountryCode as PlaidCountryCodes,
  Products as PlaidProducts,
} from "plaid";

import { Dynamo } from "@mangrove/core/dynamo";

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

type PlaidConnection = Entity<typeof Dynamr.Schema.models.PlaidConnection>;

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

  const conn: PlaidConnection = {
    type: "plaid_connection",
    id: item_id,
    user: user,
    token: access_token,
  };

  await PlaidConnection.create(conn);
  return item_id;
}

export async function remove_connection(user: string, id: string) {
  await PlaidConnection.remove({ user, id });

  await api.itemAccessTokenInvalidate({
    access_token: "tok123",
  });

  return id;
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

      const accounts = await api.accountsGet({ access_token: item.token });

      return {
        id: item.id,
        kind: "plaid",
        institution: inst.data.institution.name,
        accounts: accounts.data.accounts.map((acct) => {
          return {
            id: acct.account_id,
            name: acct.name,
            category: acct.type,
            subcategory: acct.subtype,
          };
        }),
      };
    })
  );

  return conns;
}

export async function account_info(user: string, conn: string, id: string) {
  const item = await PlaidConnection.get({ user: user, id: conn });
  const resp = await api.accountsGet({ access_token: item!.token });
  const account = resp.data.accounts.find((acct) => acct.account_id === id);

  return {
    id: account?.account_id,
    name: account?.name,
    kind: account?.type,
    subkind: account?.subtype,
  };
}
