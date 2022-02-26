import { Resolvers } from "./types";
import { Connection } from "@mangrove/backend/core/connection";

export const SlackResolver: Resolvers = {
  Mutation: {
    startSlackAuth: async (parent, args, ctx) => {
      const url = await Connection.Slack.auth_start(args.input.user);

      return {
        url,
        user: "usr123",
      };
    },
  },
};
