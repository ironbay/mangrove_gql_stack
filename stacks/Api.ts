import * as sst from "@serverless-stack/resources";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

import { Dynamo } from "./Dynamo";
import { Database } from "./Database";
import { Auth } from "./Auth";
import { Parameter } from "./Parameter";

type Props = {
  dynamo: Dynamo["outputs"];
  db: Database["outputs"];
  auth: Auth["outputs"];
};

export class Api extends sst.Stack {
  public readonly outputs: {
    apollo: string;
  };

  constructor(scope: sst.App, props: Props) {
    super(scope, "api");

    const bucket = new sst.Bucket(this, "bucket");
    bucket.s3Bucket.addCorsRule({
      allowedMethods: [HttpMethods.PUT],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
    });

    const graphql = new sst.GraphQLApi(this, "graphql", {
      server: {
        handler: "functions/graphql/graphql.handler",
        bundle: {
          format: "esm",
        },
      },
      codegen: "./graphql/codegen.yml",
      defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
    });
    props.db.cluster.rdsServerlessCluster.grantDataApiAccess(
      graphql.serverFunction
    );
    props.db.cluster.rdsServerlessCluster.secret?.grantRead(
      graphql.serverFunction
    );

    const api = new sst.Api(this, "APi", {});
    api.attachPermissions([props.dynamo.table]);

    Parameter.use(
      graphql.serverFunction,
      new Parameter(this, { name: "BUCKET", value: bucket.bucketName }),
      new Parameter(this, {
        name: "RDS_SECRET",
        value: props.db.cluster.secretArn,
      }),
      new Parameter(this, {
        name: "RDS_ARN",
        value: props.db.cluster.clusterArn,
      }),
      new Parameter(this, {
        name: "RDS_DATABASE",
        value: "starter",
      }),
      new Parameter(this, {
        name: "COGNITO_USER_POOL_ID",
        value: props.auth.userPool.userPoolId,
      }),
      new Parameter(this, {
        name: "MY_SPECIAL_CONFIG",
      }),
      new Parameter(this, {
        name: "DYNAMO_TABLE",
        value: props.dynamo.table.tableName,
      }),
      new Parameter(this, {
        name: "PLAID_CLIENT_ID",
      }),
      new Parameter(this, {
        name: "PLAID_SECRET",
      })
    );

    this.outputs = {
      apollo: graphql.url,
    };
  }
}
