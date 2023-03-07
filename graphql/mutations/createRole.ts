// Package modules
import { ApolloError } from "apollo-server";
import { mutationField, nonNull, stringArg } from "nexus";

// Local modules
import { ROLE_NAME } from "../../utils/constants";

export const createRole = mutationField("createRole", {
  type: "Role",
  args: {
    name: nonNull(stringArg()),
  },
  resolve: async (_root, { name }, ctx, _info) => {
    if (!Object.values(ROLE_NAME).includes(name)) {
      throw new ApolloError("Wrong Role name!");
    }

    const role = await ctx.db.role.findFirst({
      where: {
        name
      }
    });

    if (role) {
      return role;
    }

    try {
      const role = await ctx.db.role.create({
        data: {
          name
        }
      });
      return role;
    } catch(e) {
      throw new ApolloError("Something went wrong!");
    }
  }
});
