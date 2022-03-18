import { Dynamo } from "@mangrove/core/dynamo";
import { Entity } from "dynamodb-onetable";
import { Connection } from "@mangrove/core/connection";

type Pipe = Entity<typeof Dynamo.Schema.models.Pipe>;
type NumberFilter = Entity<typeof Dynamo.Schema.models.NumberFilter>;
type StringFilter = Entity<typeof Dynamo.Schema.models.StringFilter>;
type Source = Entity<typeof Dynamo.Schema.models.Source>;
type Destination = Entity<typeof Dynamo.Schema.models.Destination>;

const NumberFilter = Dynamo.Table.getModel<NumberFilter>("NumberFilter");
const Pipe =
  Dynamo.Table.getModel<Entity<typeof Dynamo.Schema.models.Pipe>>("Pipe");

export async function list(user: string) {
  const items = await Dynamo.Table.queryItems(
    {
      pk: `user#${user}`,
      sk: { begins: "pipe#" },
    },
    { parse: true }
  );

  const pipes = await Promise.all(
    items
      .filter((item) => item.type === "PIPE")
      .map((item) => item as Pipe)
      .map(async (pipe) => {
        const sources = await build_sources(user, pipe.id, items);
        const destinations = await build_destinations(user, pipe.id, items);

        return {
          flags: {
            enabled: pipe.flag_enabled,
          },
          sources,
          destinations,
        };
      })
  );

  return pipes;
}

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

        const account = await Connection.Plaid.account_info(
          user,
          source.connection,
          source.account
        );

        return {
          id: source.id,
          filters: filters,
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
