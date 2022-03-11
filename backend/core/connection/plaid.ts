import { Config } from "@serverless-stack/node/config";
import { Entity, Model, Table } from "dynamodb-onetable";

import {
  Configuration as PlaidConfig,
  PlaidApi,
  PlaidEnvironments,
  CountryCode as PlaidCountryCodes,
  Products as PlaidProducts,
} from "plaid";

import { Dynamo } from "@mangrove/backend/core/dynamo";
import { SchemaMetaFieldDef } from "graphql";
import { create } from "domain";

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
