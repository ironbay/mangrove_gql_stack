import * as sst from "@serverless-stack/resources";
import { Auth } from "./Auth";
import { Database } from "./Database";
import { Dynamo } from "./Dynamo";
import { Frontend } from "./Frontend";
import { RemovalPolicy } from "aws-cdk-lib";
import { init } from "./Functional";
import { GraphQL } from "./Graphql";
import { Upload } from "./Upload";

export default async function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {
      SSM_PREFIX: `/${app.name}/${app.stage}`,
      SSM_FALLBACK: `/${app.name}/fallback`,
    },
  });
  if (app.local) app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

  //   const dynamo = new Dynamo(app);
  //   const db = new Database(app);
  //   const auth = new Auth(app);
  //   const api = new Api(app, {
  //     dynamo: dynamo.outputs,
  //     db: db.outputs,
  //     auth: auth.outputs,
  //   });

  //   new Frontend(app, {
  //     api: api.outputs,
  //     auth: auth.outputs,
  //   });

  await init(app, Database, Auth, Upload, Dynamo, GraphQL, Frontend);
}
