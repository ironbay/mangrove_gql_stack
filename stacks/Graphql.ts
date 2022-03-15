import * as sst from "@serverless-stack/resources";

import { Parameter } from "./Parameter";
import { FunctionalStackProps, use } from "./Functional";
import { Database } from "./Database";
import { Upload } from "./Upload";
import { Auth } from "./Auth";
import { Dynamo } from "./Dynamo";

export function GraphQL(props: FunctionalStackProps) {
  const db = use(Database);
  const upload = use(Upload);
  const auth = use(Auth);
  const dynamo = use(Dynamo);

  const graphql = new sst.GraphQLApi(props.stack, "graphql", {
    server: {
      handler: "functions/graphql/graphql.handler",
      permissions: [db.cluster, upload.bucket, dynamo.table],
      bundle: {
        format: "esm",
      },
    },
    defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
    codegen: "./graphql/codegen.yml",
  });

  new sst.Api(props.stack, "APi", {});

  Parameter.use(
    graphql.serverFunction,
    upload.parameters.UPLOAD_BUCKET,
    db.parameters.RDS_ARN,
    db.parameters.RDS_SECRET,
    db.parameters.RDS_DATABASE,
    auth.parameters.COGNITO_USER_POOL_ID,
    dynamo.parameters.DYNAMO_TABLE,
    new Parameter(props.stack, "SLACK_CLIENT_ID"),
    new Parameter(props.stack, "SLACK_CLIENT_SECRET")
  );

  return graphql;
}
