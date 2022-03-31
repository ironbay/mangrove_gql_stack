import { Api, StackContext, use } from "@serverless-stack/resources";
import { Events } from "./Events";

export function Rest(props: StackContext) {
  const api = new Api(props.stack, "REST", {
    routes: {
      "POST /plaid/incoming": "../backend/functions/events/plaid.incoming",
    },
  });
}
