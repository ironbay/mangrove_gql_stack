import { Config } from "@serverless-stack/node/config";

declare module "@serverless-stack/node" {
  interface ConfigType {
    // RDS_DATABASE: string;
    // RDS_SECRET: string;
    // RDS_ARN: string;
    BUCKET: string;
    COGNITO_USER_POOL_ID: string;
    MY_SPECIAL_CONFIG: string;
    PLAID_CLIENT_ID: string;
    PLAID_SECRET: string;
    SLACK_CLIENT_ID: string;
    SLACK_CLIENT_SECRET: string;
  }
}
