import { SQSRecord, SQSEvent } from "aws-lambda";
import { Actor } from "../context";

export interface Events {}
export type EventTypes = keyof Events;
export type FromType<T extends EventTypes> = payload<T, Events[T]>;

export type payload<T extends string, P extends Record<string, any>> = {
  id: string;
  source: "mangrove";
  type: T;
  properties: P;
  actor: Actor;
};

export function createHandler<T extends EventTypes>(
  cb: (event: FromType<T>, record: SQSRecord) => Promise<void>
) {
  const results = async (event: SQSEvent) => {
    const promises = [];
    for (const record of event.Records) {
      const msg = JSON.parse(record.body);

      async function run() {
        try {
          await cb(msg.detail as FromType<T>, record);
        } catch (e) {
          console.error(e);
          return { type: "error", messageId: record.messageId };
        }
      }
      promises.push(run());
    }
    const results = await Promise.all(promises);
    return {
      batchItemFailures: results
        .filter((i) => i.type === "error")
        .map((i) => ({
          itemIndentifier: i,
        })),
    };
  };

  return results;
}

export * as Bus from ".";
