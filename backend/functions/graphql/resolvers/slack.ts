import { Resolvers } from "./types";
import { Connection } from "@mangrove/backend/core/connection";

export const SlackResolver: Resolvers = {
  Mutation: {
    startSlackAuth: async (parent, args, ctx) => {
      console.log(ctx);
      return {
        url: "ok",
        user: "usr123",
      };
    },
  },
};
