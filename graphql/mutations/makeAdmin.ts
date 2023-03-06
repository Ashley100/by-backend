// Package modules
import { booleanArg, intArg, mutationField, nonNull } from "nexus";

// Local modules
import { ROLES } from "../../utils/constants";

export const makeAdmin = mutationField("makeAdmin", {
  type: "User",
  args: {
    id: nonNull(intArg()),
    isAdmin: nonNull(booleanArg())
  },
  resolve: async (_root, { id, isAdmin }, ctx, _info) => {
    const user = await ctx.db.user.update({
      where: {
        id
      },
      data: {
        role: isAdmin ? ROLES.ADMIN : ROLES.USER
      }
    });

    return user;
  },
});
