import { Pipe } from "@mangrove/core/pipe";
import { Resolvers } from "./types";

export const PipeResolver: Resolvers = {
  User: {
    pipes: async (parent, _args, _ctx) => {
      const pipes = await Pipe.list(parent.id!);
      return pipes;
    },
  },
};
