import { Config } from "@serverless-stack/node";
import {
  Configuration as PlaidConfig,
  PlaidApi,
  PlaidEnvironments,
  CountryCode as PlaidCountryCodes,
  Products as PlaidProducts,
} from "plaid";

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

export async function start() {
  const token = api
    .linkTokenCreate({
      language: "en",
      client_name: "mangrove",
      country_codes: [PlaidCountryCodes.Us],
      user: {
        client_user_id: "usralanrice",
      },
      products: [PlaidProducts.Transactions],
    })
    .then((resp) => {
      console.log(resp);
      return resp.data.link_token;
    })
    .catch((e) => {
      console.log(e);
      return e;
    });

  return token;
}
