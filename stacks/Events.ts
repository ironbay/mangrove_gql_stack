import { EventBus, StackContext } from "@serverless-stack/resources";

export function Events(ctx: StackContext) {
  const bus = new EventBus(ctx.stack, "BUS", {
    rules: {
      plaid_hook: {
        eventPattern: { source: ["plaid.incoming"] },
        targets: ["../backend/functions/events/plaid.incoming"],
      },
      mangrove_tx: {
        eventPattern: { source: ["plaid.tx"] },
        targets: ["../backend/functions/events/plaid.tx"],
      },
    },
  });

  return bus;
}
