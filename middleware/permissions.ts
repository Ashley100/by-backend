// Package modules
import { rule, shield, allow } from "graphql-shield";

// Local modules
import { Context } from "../context";
import { ROLES } from "../utils/constants";

const isAdmin = rule()(async (_parent, _args, ctx: Context, _info) => ctx.user?.role === ROLES.ADMIN);

export const permissions = shield({
  Mutation: {
    makeAdmin: isAdmin,
    createUser: isAdmin
  }
}, {
  fallbackRule: allow
});