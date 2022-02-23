import { Table } from "dynamodb-onetable";
import { Config } from "@serverless-stack/node";
import DynamoDB from "aws-sdk/clients/dynamodb";

const schema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: {
      hash: "pk",
      sort: "sk",
    },
  },
  models: {
    Account: {
      pk: { type: String, value: "account:${name}" },
      sk: { type: String, value: "account:" },
      id: { type: String },
      name: { type: String },
    },
  },
};

const client = new DynamoDB.DocumentClient({});
const table = new Table({
  client,
  name: Config.DYNAMO_TABLE,
  schema,
});

export default {
  Table: table,
};
