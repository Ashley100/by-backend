// Package modules
import {extendType} from "nexus";

export const userProfile = extendType({
  type: "Query",
  definition(t) {
    t.field("userProfile", {
      type: "User",
      resolve: async (_root, _args, ctx, _info) => {
        const userId = ctx.user?.id;

        const user = await ctx.db.user.findUnique({
          where: { id: userId }
        });

        return user;
      },
    });
  },
});
