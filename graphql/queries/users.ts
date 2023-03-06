// Package modules
import {extendType, list, nonNull} from "nexus";

export const users = extendType({
  type: "Query",
  definition(t) {
    t.field("users", {
      type: nonNull(list(nonNull("User"))),
      resolve: async (_root, _args, ctx, info) => {
        const users = await ctx.db.user.findMany({});
        return users;
      },
    });
  },
});
