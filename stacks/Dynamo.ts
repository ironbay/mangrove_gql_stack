import {
  Table,
  StackContext,
  TableFieldType,
} from "@serverless-stack/resources";
import { Parameter } from "./Parameter";

export function Dynamo(ctx: StackContext) {
  const table = new Table(ctx.stack, "DYNAMO", {
    fields: {
      pk: TableFieldType.STRING,
      sk: TableFieldType.STRING,
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
  });

  return {
    table,
    params: Parameter.create(ctx.stack, {
      DYNAMO_TABLE: table.tableName,
    }),
  };
}
