import { Resolvers } from "./types";
import { Connection } from "@mangrove/backend/core/connection";

export const PlaidResolver: Resolvers = {
  Mutation: {
    plaidStart: async (parent, args, ctx) => {
      const token = await Connection.Plaid.start();

      return {
        public_token: token,
        state: `user state: alan`,
      };
    },
    plaidFinish: async (parent, args, ctx) => {
      const { user, public_token } = args.input;
      const item_id = await Connection.Plaid.finish(user, public_token);

      return {
        item_id,
      };
    },
  },
};
