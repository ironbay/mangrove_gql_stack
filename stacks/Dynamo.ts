import * as sst from "@serverless-stack/resources";
import { FunctionalStackProps } from "./Functional";
import { Parameter } from "./Parameter";

export function Dynamo(props: FunctionalStackProps) {
  const table = new sst.Table(props.stack, "DYNAMO", {
    fields: {
      pk: sst.TableFieldType.STRING,
      sk: sst.TableFieldType.STRING,
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
  });

  return {
    table,
    parameters: Parameter.create(props.stack, {
      DYNAMO_TABLE: table.tableName,
    }),
  };
}
