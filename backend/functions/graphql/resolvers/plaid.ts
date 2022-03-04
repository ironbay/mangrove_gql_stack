import { Resolvers } from "./types";
import { Connection } from "@mangrove/backend/core/connection";

export const PlaidResolver: Resolvers = {
  Mutation: {
    startPlaidAuth: async (parent, args, ctx) => {
      const token = await Connection.Plaid.start_auth(args.input.user);

      return {
        public_token: token,
        state: `user state: alan`,
      };
    },
    finishPlaidAuth: async (parent, args, ctx) => {
      const item_id = await Connection.Plaid.finish_auth(
        args.input.user,
        args.input.public_token
      );

      return {
        item_id,
      };
    },
  },
};
