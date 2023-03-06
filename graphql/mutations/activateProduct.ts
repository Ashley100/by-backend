// Package modules
import {
  nonNull,
  intArg,
  mutationField,
  nullable,
  booleanArg
} from "nexus";

// Local modules
import {Product} from "../types";

export const activateProduct = mutationField("activateProduct", {
  type: nullable(Product),
  args: {
    id: nonNull(intArg()),
    status: nonNull(booleanArg())
  },
  resolve: async (_root, { id, status }, ctx) => {
    const product = await ctx.db.product.update({
      where: {
        id: id
      },
      data: {
        active: status
      }
    });

    return product;
  }
});
