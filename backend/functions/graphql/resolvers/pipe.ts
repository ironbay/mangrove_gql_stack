import { Pipe } from "@mangrove/core/pipe";
import { Resolvers } from "./types";

export const PipeResolver: Resolvers = {
  User: {
    pipes: async (parent, args, ctx) => {
      return await Pipe.list(parent.id!);
    },
  },
};
