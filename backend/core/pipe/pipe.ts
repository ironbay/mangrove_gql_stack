import { Dynamo } from "@mangrove/core/dynamo";
import { cursorPaginationEnabledMethods } from "@slack/web-api";
import { EntityType } from "aws-sdk/clients/iam";
import { Entity } from "dynamodb-onetable";

type Pipe = Entity<typeof Dynamo.Schema.models.Pipe>;
const Pipe =
  Dynamo.Table.getModel<Entity<typeof Dynamo.Schema.models.Pipe>>("Pipe");

type NumberFilter = Entity<typeof Dynamo.Schema.models.NumberFilter>;
type StringFilter = Entity<typeof Dynamo.Schema.models.StringFilter>;

export async function list(user: string) {
  const items = await Dynamo.Table.queryItems(
    {
      pk: `user#${user}`,
      sk: { begins: "pipe#" },
    },
    { parse: true }
  );

  const raw_pipes = items
    .filter((item) => item.type === "PIPE")
    .map((item) => item as Pipe)
    .reduce((prev, curr) => {
        prev[curr.id] = {
          id: curr.id,
          name: curr.name, 
          flags: {
              enabled: curr.
          }, 
          filters: []
        };
        return prev
    }, {} as {[key: string]: {
        id: string, 
        name: string, 
        flags: {
            enabled: boolean, 
        }, 
        sources: [], 
        destinations: []
    }});


  const objecto = items.reduce((prev, curr) => {
    if (curr.type === "NUMBER_FILTER") {
      const { id, name, op, value, pipe } = curr as NumberFilter;
      const formatted = {
        id,
        name,
        op,
        num: value,
      };

      if (!prev[pipe]) {
        prev[pipe] = { id: pipe, filters: [formatted] };
        return prev;
      }
      prev[pipe].filters = [...prev.pipe.filters, formatted];
      return prev;
    }
    if (curr.type === "STRING_FILTER") {
      const { id, name, op, value, pipe } = curr as StringFilter;
      const formatted = {
        id,
        name,
        op,
        text: value,
      };

      if (!prev[pipe]) {
      }
    }
    if (curr.type === "PIPE") {
      const parsed = curr as StringFilter;
    }
  }, {});

  items.map((item) => {
    if (item.kind === "NUMBER_FILTER") {
      const parsed = item as NumberFilter;
    }
  });
}


