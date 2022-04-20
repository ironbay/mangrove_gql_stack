import { Dynamo } from "@mangrove/core/dynamo";
// import { Entity } from "dynamodb-onetable";
import { Connection } from "@mangrove/core/connection";

import { Entity, EntityItem, Service } from "electrodb";
import { Pipe } from ".";
import { Source } from "graphql";
import { EventSourceState } from "@aws-sdk/client-eventbridge";
import { FilterNode } from "kysely";

const PipeEntity = new Entity({
  model: {
    entity: "Pipe",
    version: "1",
    service: "mangrove",
  },
  attributes: {
    pipeID: {
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
      collection: "pipe",
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
        composite: [],
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
    pipeID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    sourceID: {
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
      collection: "pipe",
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

const NumberFilterEntity = new Entity({
  model: {
    entity: "NumberFilter",
    version: "1",
    service: "mangrove",
  },
  attributes: {
    filterID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    pipeID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    sourceID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    op: {
      type: "string",
      required: true,
      readOnly: false,
    },
    kind: {
      type: "string",
      required: true,
      readOnly: true,
    },
    value: {
      type: "number",
      required: true,
      readOnly: false,
    },
  },
  indexes: {
    numberFilter: {
      pk: {
        field: "pk",
        composite: ["filterID"],
      },
      sk: {
        field: "sk",
        composite: ["pipeID", "sourceID"],
      },
    },
    pipe: {
      collection: "pipe",
      index: "gsi1",
      pk: {
        field: "gsi1pk",
        composite: ["pipeID"],
      },
      sk: {
        field: "gsi1sk",
        composite: ["sourceID"],
      },
    },
    source: {
      index: "gsi2",
      pk: {
        field: "gsi2pk",
        composite: ["sourceID"],
      },
      sk: {
        field: "gsi2sk",
        composite: [],
      },
    },
  },
});

const SlackDestinationEntity = new Entity({
  model: {
    entity: "SlackDestination",
    version: "1",
    service: "mangrove",
  },
  attributes: {
    pipeID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    SlackDestinationID: {
      type: "string",
      required: true,
      readOnly: true,
    },
    slackTeamID: {
      type: "string",
      required: true,
      readOnly: false,
    },
    slackChannelID: {
      type: "string",
      required: true,
      readOnly: false,
    },
  },
  indexes: {
    slackDestination: {
      collection: "pipe",
      pk: {
        field: "pk",
        composite: ["pipeID"],
      },
      sk: {
        field: "sk",
        composite: ["slackDestinationID"],
      },
    },
  },
});

const PipeService = new Service({
  pipes: PipeEntity,
  slackDestinations: SlackDestinationEntity,
  plaidSources: PlaidSourceEntity,
  numberFilters: NumberFilterEntity,
});

export async function list_for_user(user: string) {
  const pipes = await PipeEntity.query.user({ userID: user }).go();
  return Promise.all(pipes.map((p) => info(p.pipeID)));
}

async function alan() {
  const res = await list_for_user("alan");
}

function info(pipeID: string) {
  return PipeService.collections.pipe({ pipeID }).go();
}

// type PipeEntityType = EntityItem<typeof PipeEntity>

// const Pipes = new Service({ pipes: PipeEntity, plaidSources: PlaidSourceEntity, numberFilters: NumberFilterEntity})

// export async function for_user(user: string) {
//     const pipes = await PipeEntity.query.user({ userID: user }).go();

//     for (let pipe of pipes) {
//         const pipe_info = await Pipes.collections.pipe({ pipeID: pipe.pipeID }).go()
//     }
// }

// async function info(pipe: string) {
//     const info =
// }

// async function sources(pipe: string) {
//     const sources = await PlaidSourceEntity.query.primary({pipeID: pipe}).go()

//     for (let source of sources) {
//         const filters = await NumberFilterEntity.query.source({ sourceID: source.sourceID})
//     }
// }

// export async function filters(pipe: string, source: string ) {
//     return NumberFilterEntity.query.pipe({pipeID: pipe, sourceID: source}).go()
// }

// //   get all pipes for a user
// //  get all sources for a pipe
// //  get all filters for source

// //   const plaid_source_query = PlaidSourceEntity.query.pipes({ })

// //   for (let pipe of pipes) {
// //       plaid_source_query.where({})
// //   }

// //   const sources = await PlaidSourceEntity.query.primary({pipeID => })
// }

// // export async function list(user: string) {
// //   const items = await Dynamo.Table.queryItems(
// //     {
// //       pk: `user#${user}`,
// //       sk: { begins: "pipe#" },
// //     },
// //     { parse: true }
// //   );

// //   const pipes = await Promise.all(
// //     items
// //       .filter((item) => item.type === "PIPE")
// //       .map((item) => item as Pipe)
// //       .map(async (pipe) => {
// //         const sources = await build_sources(user, pipe.id, items);
// //         const destinations = await build_destinations(user, pipe.id, items);

// //         return {
// //           flags: {
// //             enabled: pipe.flag_enabled,
// //           },
// //           sources,
// //           destinations,
// //         };
// //       })
// //   );

// //   return pipes;
// // }

// async function build_sources(
//   user: string,
//   pipe: string,
//   items: (NumberFilter | StringFilter | Pipe | Source)[]
// ) {
//   return await Promise.all(
//     items
//       .filter((item) => Dynamo.starts_with(item.sk!, `pipe#${pipe}#source`))
//       .map((src) => src as Source)
//       .map(async (source) => {
//         const filters = items
//           .filter(
//             (item) =>
//               item.sk!.indexOf(`pipe#${pipe}#source#${source}#filter`) !== -1
//           )
//           .map((filter) => {
//             if (filter.type === "NUMBER_FILTER") {
//               const { id, name, op, value } = filter as NumberFilter;

//               return {
//                 id,
//                 name,
//                 op,
//                 num: value,
//               };
//             }
//             const { id, name, op, value } = filter as StringFilter;
//             return {
//               id,
//               name,
//               op,
//               text: value,
//             };
//           });

//         const connection = await Connection.Plaid.get(user, source.connection);
//         const account = connection.accounts.find(
//           (acct) => acct.id === source.account
//         );

//         return {
//           id: source.id,
//           filters: filters,
//           connection,
//           account,
//         };
//       })
//   );
// }

// async function build_destinations(
//   user: string,
//   pipe: string,
//   items: (NumberFilter | StringFilter | Pipe | Source)[]
// ) {
//   const destinations = await Promise.all(
//     items
//       .filter((item) =>
//         Dynamo.starts_with(item.sk || "", `pipe#${pipe}#destination`)
//       )
//       .map((d) => d as Destination)
//       .map(async (item) => {
//         const connection = await Connection.Slack.get(user, item.id);
//         const channel = connection.channels.find(
//           (channel) => channel.id === item.connection
//         )!;

//         return {
//           id: item.id!,
//           connection,
//           channel,
//         };
//       })
//   );

//   return destinations;
// }
