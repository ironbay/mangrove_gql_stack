import { Connection } from "@mangrove/core/connection";
import { Resolvers } from "./types";

export const ConnectionResolver: Resolvers = {
  User: {
    connections: async (parent, args, _ctx) => {
      const plaid = await Connection.Plaid.connections(parent.id!);
    },
  },
};
