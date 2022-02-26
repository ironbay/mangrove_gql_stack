import { Resolvers } from "./types";

export const PlaidResolver: Resolvers = {
  Mutation: {
    createPlaidStart: (parent, args, ctx) => {
      console.log(ctx);
      console.log(parent);
      console.log(args);
      const user = args.input.user;
      return {
        public_token: "public_token123",
        state: `user state: ${user}`,
      };
    },
  },
};
