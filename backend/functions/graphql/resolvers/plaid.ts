import { Resolvers } from "./types";
import { Connection } from "@mangrove/backend/core/connection";

export const PlaidResolver: Resolvers = {
  Mutation: {
    createPlaidStart: async (parent, args, ctx) => {
      const token = await Connection.Plaid.start();

      return {
        public_token: token,
        state: `user state: alan`,
      };
    },
    removePlaid: (parnet, args, ctx) => {
      const user = args.input.user_id;
      return {
        id: "id123",
        user_id: "123",
      };
    },
  },
};
