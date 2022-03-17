import { Dynamo } from "@mangrove/core/dynamo";
import { Entity } from "dynamodb-onetable";
import { Connection } from "@mangrove/core/connection"

type Pipe = Entity<typeof Dynamo.Schema.models.Pipe>;
const Pipe =
  Dynamo.Table.getModel<Entity<typeof Dynamo.Schema.models.Pipe>>("Pipe");

type NumberFilter = Entity<typeof Dynamo.Schema.models.NumberFilter>;
const NumberFilter = Dynamo.Table.getModel<NumberFilter>("NumberFilter");
type StringFilter = Entity<typeof Dynamo.Schema.models.StringFilter>;
type Source = Entity<typeof Dynamo.Schema.models.Source>("Source"); 

export async function list(user: string) {
  const items = await Dynamo.Table.queryItems(
    {
      pk: `user#${user}`,
      sk: { begins: "pipe#" },
    },
    { parse: true }
  );

//   items
//     .filter((item) => item.type === "PIPE")
//     .reduce((prev, curr) => {
//       const sources = build_sources(pipe, items);
//     }, {});
}

function build_soures(
    user: string, 
  pipe: string,
  items: (NumberFilter | StringFilter | Pipe | Source)[]
) {
    return items.filter(item => item.sk!.indexOf(`pipe#${pipe}#source`) && item.type === "SOURCE").map(src => src as Source).map((source) => {
        const filters = items.filter(item => item.sk!.indexOf(`pipe#${pipe}#source#${source}#filter`) !== -1).map(filter => {
            if (filter.type === "NUMBER_FILTER") {
                const { id, name, op, value} = filter as NumberFilter

                return {
                    id,
                    name,
                    op,
                    num: value
                }
            }
            const { id, name, op, value} = filter as StringFilter
                return {
                    id, 
                    name, 
                    op, 
                    text: value
            }
        })

        const account = await Connection.Plaid.account_info(user, source.connection, source.account)

        return {
            id: source.id, 
            filters: filters, 
            account, 
        }
    })
};

