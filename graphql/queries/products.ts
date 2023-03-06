// Package modules
import {enumType, extendType, intArg, nonNull, stringArg} from "nexus";

// Local modules
import {Prisma} from ".prisma/client";
import {ProductsPayload} from "../types";
import {ROLES} from "../../utils/constants";

const DEFAULT_PRODUCTS_AMOUNT = 10;
const DEFAULT_SKIP_PRODUCTS_AMOUNT = 0;

export const products = extendType({
  type: "Query",
  definition(t) {
    t.field("products", {
      type: ProductsPayload,
      args: {
        first: nonNull(intArg({ default: DEFAULT_PRODUCTS_AMOUNT })),
        skip: nonNull(intArg({ default: DEFAULT_SKIP_PRODUCTS_AMOUNT })),
        searchBy: stringArg(),
        filter: enumType({
          name: "ProductsFilter",
          members: ["all", "active"],
        }),
      },
      resolve: async (_root, { skip, first, searchBy, filter }, ctx) => {
        const isAdmin = ctx.user?.role === ROLES.ADMIN;

        const searchOrQuery: Prisma.Enumerable<Prisma.ProductWhereInput> = searchBy
          ? searchBy.split(" ").map((word) => ({
            OR: [
              {
                title: { contains: word },
              },
              {
                description: { contains: word },
              },
            ],
          }))
          : {};

        const searchByFilter: Prisma.ProductWhereInput = searchOrQuery
          ? { AND: searchOrQuery }
          : {};

        // User can view only active pruducts
        let activeFilter: Prisma.ProductWhereInput = { active: true };

        // Admin can view both only active or all products 
        if (isAdmin) {
          activeFilter = filter !== "all"
            ? { active: !!filter }
            : {};
        }

        const where: Prisma.ProductWhereInput = {
          ...searchByFilter,
          ...activeFilter
        };

        const data = await ctx.db.product.findMany({ take: first, skip, where });
        const count = await ctx.db.product.count({ where });

        return {
          count,
          data,
          hasMore: first + skip <= count
        }
      },
    })
  }
});
