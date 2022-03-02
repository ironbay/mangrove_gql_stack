import { Config } from "@serverless-stack/node";

export function name() {
  return Config.PLAID_CLIENT_ID;
}
