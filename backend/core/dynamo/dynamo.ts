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
    Pipe: {
      type: { type: String },
      pk: { type: String, value: "user#${user_id}" },
      sk: { type: String, value: "pipe#${id}" },
      user_id: { type: String },
      id: { type: String },
    },
    Flag: {
      type: { type: String },
      pk: { type: String, value: "user#${user_id}" },
      sk: { type: String, value: "pipe#${pipe_id}#flag#enabled" },
      user_id: { type: String },
      id: { type: String },
      enabled: { type: Boolean },
    },
    NumberFilter: {
      type: { type: String },
      pk: { type: String, value: "user#${user_id}" },
      sk: {
        type: String,
        value: "pipe#${pipe_id}#source#${source_id}#filter#${id}",
      },
      user_id: { type: String },
      pipe_id: { type: String },
      source_id: { type: String },
      id: { type: String },
      account: { type: String },
      kind: { type: String },
      name: { type: String },
      value: { type: Number },
      op: { type: String },
    },
    StringFilter: {
      type: { type: String },
      pk: { type: String, value: "user#${user_id}" },
      sk: {
        type: String,
        value: "pipe#${pipe_id}#source#${source_id}#filter#${id}",
      },
      user_id: { type: String },
      pipe_id: { type: String },
      source_id: { type: String },
      id: { type: String },
      account: { type: String },
      kind: { type: String },
      name: { type: String },
      value: { type: String },
      op: { type: String },
    },
    Connection: {
      type: { type: String },
      pk: { type: String, value: "user#${user_id}" },
      sk: { type: String, value: "connection#${id}" },
      id: { type: String },
      token: { type: String },
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
