import * as sst from "@serverless-stack/resources";

export class Dynamo extends sst.Stack {
  public readonly outputs: {
    table: sst.Table;
  };

  constructor(scope: sst.App) {
    super(scope, "dynamo");

    const table = new sst.Table(this, "DYNAMO", {});

    this.outputs = {
      table,
    };
  }
}
