import { Table as OneTable } from "dynamodb-onetable";
import { Config } from "@serverless-stack/node/config";
import DynamoDB from "aws-sdk/clients/dynamodb";

export const Schema = {
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
      type: { type: String, required: true },
      pk: { type: String, value: "user#${user}", required: true },
      sk: { type: String, value: "pipe#${id}", required: true },
      id: { type: String, required: true },
      user: { type: String, required: true },
      name: { type: String, required: true },
      flag_enabled: { type: Boolean, required: true },
    },
    NumberFilter: {
      type: { type: String },
      pk: { type: String, value: "user#${user}" },
      sk: {
        type: String,
        value: "pipe#${pipe}#source#${source}#filter#${id}",
      },
      user: { type: String },
      pipe: { type: String, required: true },
      source: { type: String },
      id: { type: String },
      account: { type: String },
      kind: { type: String },
      name: { type: String },
      value: { type: Number },
      op: { type: String },
    },
    StringFilter: {
      type: { type: String },
      pk: { type: String, value: "user#${user}" },
      sk: {
        type: String,
        value: "pipe#${pipe}#source#${source}#filter#${id}",
      },
      user: { type: String },
      pipe: { type: String },
      source: { type: String },
      id: { type: String },
      account: { type: String },
      kind: { type: String },
      name: { type: String },
      value: { type: String },
      op: { type: String },
    },
    PlaidConnection: {
      type: { type: String, required: true },
      pk: { type: String, value: "user#${user}" },
      sk: { type: String, value: "connection#plaid#${id}" },
      id: { type: String, required: true },
      user: { type: String, required: true },
      token: { type: String, required: true },
    },
    SlackConnection: {
      type: { type: String, required: true },
      pk: { type: String, value: "user#${user}" },
      sk: { type: String, value: "connection#slack#${id}" },
      id: { type: String, required: true },
      user: { type: String, required: true },
      token: { type: String, required: true },
    },
  },
} as const;

const client = new DynamoDB.DocumentClient({});

export const Table = new OneTable({
  client,
  name: Config.DYNAMO_TABLE,
  schema: Schema,
});
