// Package modules
import {list, nonNull, queryField} from "nexus";

export const roles = queryField("roles", {
  type: nonNull(list(nonNull("Role"))),
  resolve: async (_root, _args, ctx, _info) => {
    const roles = await ctx.db.role.findMany({});
    return roles;
  }
});
