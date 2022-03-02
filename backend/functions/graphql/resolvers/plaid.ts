import { Resolvers } from "./types";
import { Connection } from "@mangrove/backend/core/connection";

export const PlaidResolver: Resolvers = {
  Mutation: {
    createPlaidStart: (parent, args, ctx) => {
      const user = args.input.user;
      return {
        public_token: "public_token123",
        state: `user state: ${Connection.Plaid.name()}`,
      };
    },
    removePlaid: (parnet, args, ctx) => {
      const user = args.input.user_id;
      return {
        id: "id123",
        user_id: Connection.Plaid.name(),
      };
    },
  },
};
