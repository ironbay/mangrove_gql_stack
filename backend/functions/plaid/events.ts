import { createHandler } from "@mangrove/core/bus";
import { Connection } from "@mangrove/core/connection";

export const hook = createHandler<"plaid.hook">(async (evt) => {
  await Connection.Plaid.sync(evt.properties.user, evt.properties.item);
  // run the syncing
});

export const tx_new = createHandler<"plaid.tx.new">(async (evt) => {
  // kick off the pipes
});
