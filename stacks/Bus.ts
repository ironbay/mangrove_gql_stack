import {
  EventBus,
  FunctionDefinition,
  StackContext,
  Function,
  Queue,
  use,
} from "@serverless-stack/resources";
import { Parameter } from "./Parameter";
import { Dynamo } from "./Dynamo";

export function Bus(ctx: StackContext) {
  const eventBus = new EventBus(ctx.stack, "BUS");
  const BUS_NAME = new Parameter(ctx.stack, "BUS_NAME", eventBus.eventBusName);

  type SubscribeOpts = {
    id: string;
    function: FunctionDefinition;
    source?: string;
    types?: string[];
    parameters?: Parameter[];
  };

  function subscribe(opts: SubscribeOpts) {
    const func = Function.fromDefinition(
      ctx.stack,
      opts.id + "Function",
      opts.function
    );

    if (opts.parameters) Parameter.use(func, ...opts.parameters);

    eventBus.addRules(ctx.stack, {
      [`${opts.id}Rule`]: {
        eventPattern: {
          detailType: opts.types,
          source: ["mangrove"],
        },
        targets: [
          new Queue(ctx.stack, `${opts.id}Queue`, {
            consumer: {
              function: func,
              consumerProps: {
                batchSize: 1,
              },
            },
          }),
        ],
      },
    });
  }

  //   save the transactions to dynamo
  //   publish the event

  const dynamo = use(Dynamo);

  subscribe({
    id: "PlaidHandler",
    types: ["plaid.hook"],
    function: {
      handler: "functions/plaid/events.handler",
      permissions: [eventBus, dynamo.table],
    },
    parameters: [BUS_NAME, dynamo.params.DYNAMO_TABLE],
  });

  //   const eventBus = new EventBus(ctx.stack, "BUS", {
  //     rules: {
  //       plaid_hook: {
  //         eventPattern: {
  //           source: ["mangrove.plaid"],
  //           detailType: ["hook"],
  //         },
  //         targets: ["../backend/functions/events/plaid.sync"],
  //       },
  //       mangrove_tx: {
  //         eventPattern: { source: ["mangrove.plaid"], detailType: ["tx.new"] },
  //         targets: ["../backend/functions/events/plaid.tx"],
  //       },
  //     },
  //   });

  return {
    eventBus,
    BUS_NAME,
    subscribe,
  };
}
