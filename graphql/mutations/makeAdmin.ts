// Package modules
import { ApolloError } from "apollo-server";
import { intArg, mutationField, nonNull } from "nexus";

// Local modules
import { ROLES } from "../../utils/constants";

export const makeAdmin = mutationField("makeAdmin", {
  type: "UserRoles",
  args: {
    id: nonNull(intArg()),
  },
  resolve: async (_root, { id }, ctx, _info) => {
    const userRoles = await ctx.db.userRoles.findFirst({
      where: {
        userId: id,
        roleId: ROLES.ADMIN
      }
    });

    if (userRoles) {
      return userRoles;
    }

    try {
      const roles = await ctx.db.userRoles.create({
        data: {
          userId: id,
          roleId: ROLES.ADMIN
        }
      });
      return roles;
    } catch(e) {
      throw new ApolloError("Something went wrong!");
    }
  },
});
