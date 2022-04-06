import { Api, StackContext, use } from "@serverless-stack/resources";
import { Parameter } from "./Parameter";
import { Bus } from "./Bus";

export function Rest(props: StackContext) {
  const bus = use(Bus);

  const api = new Api(props.stack, "REST", {
    routes: {
      "POST /plaid/incoming": "../backend/functions/events/plaid.incoming",
    },
  });

  Parameter.use(api.getFunction("POST /plaid/incoming")!, bus.BUS_NAME);

  return api;
}
