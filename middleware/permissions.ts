// Package modules
import { rule, shield, allow } from "graphql-shield";

// Local modules
import { Context } from "../context";
import { ROLES } from "../utils/constants";

const isAdmin = rule()(async (_parent, _args, ctx: Context, _info) => {
  let hasAdminRole = false;

  if (ctx.user) {
    ctx.user.roles.map((role: any) => {
      if (role.roleId === ROLES.ADMIN) {
        hasAdminRole = true;
      }
    });
  }

  return hasAdminRole;
});

export const permissions = shield({
  Mutation: {
    makeAdmin: isAdmin,
    createUser: isAdmin,
    createRole: isAdmin
  }
}, {
  fallbackRule: allow
});