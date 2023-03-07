import { objectType } from "nexus";
import { Role as PrismaRole } from "nexus-prisma";

export const Role = objectType({
  name: PrismaRole.$name,
  description: PrismaRole.$description,
  definition(t) {
    t.field(PrismaRole.id);
    t.field(PrismaRole.name);
  },
});
