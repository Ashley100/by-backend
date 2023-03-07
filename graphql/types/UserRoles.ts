import { objectType } from "nexus";
import { UserRoles as PrismaUserRoles } from "nexus-prisma";

export const UserRoles = objectType({
  name: PrismaUserRoles.$name,
  description: PrismaUserRoles.$description,
  definition(t) {
    t.field(PrismaUserRoles.id);
    t.field(PrismaUserRoles.user);
    t.field(PrismaUserRoles.role);
    t.field(PrismaUserRoles.roleId);
    t.field(PrismaUserRoles.userId);
  },
});
