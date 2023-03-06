// Package modules
import { extendType, nonNull, stringArg } from "nexus";

// Local modules
import { ROLES } from "../../utils/constants";

export const createUser = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUser", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_root, { email, name }, ctx, _info) => {
        const user = await ctx.db.user.create({
          data: { email, name, role: ROLES.USER }
        });

        return user;
      },
    });
  },
});
