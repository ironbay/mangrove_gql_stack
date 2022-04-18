import { Dynamo } from "@mangrove/core/dynamo";
// import { Entity } from "dynamodb-onetable";
import { Connection } from "@mangrove/core/connection";

import { Entity } from "electrodb";

const PipeEntity = new Entity({
  model: {
    entity: "Pipe",
    version: "1",
    service: "mangrove",
  },
  attributes: {
    pipeId: {
      type: "string",
      required: true,
      readOnly: true,
    },
    userID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    name: {
      type: "string",
    },
    flags: {
      type: "map",
      properties: {
        enabled: {
          type: "boolean",
          required: true,
        },
      },
    },
  },
  indexes: {
    primary: {
      pk: {
        field: "pk",
        composite: ["pipeID"],
      },
      sk: {
        field: "sk",
        composite: ["pipeID"],
      },
    },
    user: {
      index: "gs1",
      pk: {
        field: "gs1pk",
        composite: ["userID"],
      },
      sk: {
        field: "gs1sk",
        composite: ["pipeID"],
      },
    },
  },
});

const PlaidSourceEntity = new Entity({
  model: {
    entity: "PlaidSource",
    version: "1",
    service: "mangrove",
  },
  attributes: {
    sourceID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    pipeID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    plaidItem: {
      type: "string",
      required: true,
      readOnly: false,
    },
    plaidAccount: {
      type: "string",
      required: true,
      readOnly: false,
    },
  },
  indexes: {
    primary: {
      pk: {
        field: "pk",
        composite: ["pipeID"],
      },
      sk: {
        field: "sk",
        composite: ["sourceID"],
      },
    },
  },
});

export async function from_user(user: string) {
  const;
}

// export async function list(user: string) {
//   const items = await Dynamo.Table.queryItems(
//     {
//       pk: `user#${user}`,
//       sk: { begins: "pipe#" },
//     },
//     { parse: true }
//   );

//   const pipes = await Promise.all(
//     items
//       .filter((item) => item.type === "PIPE")
//       .map((item) => item as Pipe)
//       .map(async (pipe) => {
//         const sources = await build_sources(user, pipe.id, items);
//         const destinations = await build_destinations(user, pipe.id, items);

//         return {
//           flags: {
//             enabled: pipe.flag_enabled,
//           },
//           sources,
//           destinations,
//         };
//       })
//   );

//   return pipes;
// }

async function build_sources(
  user: string,
  pipe: string,
  items: (NumberFilter | StringFilter | Pipe | Source)[]
) {
  return await Promise.all(
    items
      .filter((item) => Dynamo.starts_with(item.sk!, `pipe#${pipe}#source`))
      .map((src) => src as Source)
      .map(async (source) => {
        const filters = items
          .filter(
            (item) =>
              item.sk!.indexOf(`pipe#${pipe}#source#${source}#filter`) !== -1
          )
          .map((filter) => {
            if (filter.type === "NUMBER_FILTER") {
              const { id, name, op, value } = filter as NumberFilter;

              return {
                id,
                name,
                op,
                num: value,
              };
            }
            const { id, name, op, value } = filter as StringFilter;
            return {
              id,
              name,
              op,
              text: value,
            };
          });

        const connection = await Connection.Plaid.get(user, source.connection);
        const account = connection.accounts.find(
          (acct) => acct.id === source.account
        );

        return {
          id: source.id,
          filters: filters,
          connection,
          account,
        };
      })
  );
}

async function build_destinations(
  user: string,
  pipe: string,
  items: (NumberFilter | StringFilter | Pipe | Source)[]
) {
  const destinations = await Promise.all(
    items
      .filter((item) =>
        Dynamo.starts_with(item.sk || "", `pipe#${pipe}#destination`)
      )
      .map((d) => d as Destination)
      .map(async (item) => {
        const connection = await Connection.Slack.get(user, item.id);
        const channel = connection.channels.find(
          (channel) => channel.id === item.connection
        )!;

        return {
          id: item.id!,
          connection,
          channel,
        };
      })
  );

  return destinations;
}
