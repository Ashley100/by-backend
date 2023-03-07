// Package modules
import {list, nonNull, queryField} from "nexus";

export const users = queryField("users", {
  type: nonNull(list(nonNull("User"))),
  resolve: async (_root, _args, ctx, _info) => {
    const users = await ctx.db.user.findMany({});
    return users;
  }
});
