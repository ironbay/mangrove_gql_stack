import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { SQSRecord, SQSEvent } from "aws-lambda";
import { Actor } from "../context";
import { ulid } from "ulid";
import { Config } from "@serverless-stack/node/config";

const client = new EventBridgeClient({});

export interface Events {}
export type EventTypes = keyof Events;
export type FromType<T extends EventTypes> = payload<T, Events[T]>;

export interface Event {
  id: string;
  source: "mangrove";
  type: string;
  properties: any;
}

export type payload<T extends string, P extends Record<string, any>> = {
  id: string;
  source: "mangrove";
  type: T;
  properties: P;
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

export async function publish<T extends EventTypes>(
  type: T,
  properties: Events[T]
) {
  const payload: Event = {
    id: ulid(),
    source: "mangrove",
    type,
    properties,
  };

  await client.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: Config.BUS_NAME,
          Detail: JSON.stringify(payload),
          Source: payload.source,
          DetailType: type,
        },
      ],
    })
  );

  return payload;
}

export * as Bus from ".";
