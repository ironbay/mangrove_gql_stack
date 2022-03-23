import * as sst from "@serverless-stack/resources";
import { Authentication } from "./Authentication";
import { Database } from "./Database";
import { Frontend } from "./Frontend";
import { RemovalPolicy } from "aws-cdk-lib";
import { GraphQL } from "./Graphql";
import { Upload } from "./Upload";
import { Dynamo } from "./Dynamo";
import { Parameter } from "./Parameter";

export default async function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {
      SSM_PREFIX: `/${app.name}/${app.stage}/`,
      SSM_FALLBACK: `/${app.name}/fallback/`,
    },
  });
  if (app.local) app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

  app
    .stack(Database)
    .stack(Authentication)
    .stack(Upload)
    .stack(Dynamo)
    .stack(GraphQL)
    .stack(Frontend);
  Parameter.codegen();
}
