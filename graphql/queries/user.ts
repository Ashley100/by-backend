import {extendType, intArg, nonNull} from "nexus";

export const user = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_root, { id }, ctx, info) => {
        const user = await ctx.db.user.findUnique({
          where: { id },
        });

        return user;
      },
    });
  },
});
