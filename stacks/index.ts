import * as sst from "@serverless-stack/resources";
import { Api } from "./Api";
import { Auth } from "./Auth";
import { Database } from "./Database";
import { Dynamo } from "./Dynamo";
import { Frontend } from "./Frontend";
import { RemovalPolicy } from "aws-cdk-lib";

export default async function main(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "backend",
    environment: {},
  });
  if (app.local) app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);

  const dynamo = new Dynamo(app);
  const db = new Database(app);
  const auth = new Auth(app);
  const api = new Api(app, {
    dynamo: dynamo.outputs,
    db: db.outputs,
    auth: auth.outputs,
  });
  new Frontend(app, {
    api: api.outputs,
    auth: auth.outputs,
  });
}
