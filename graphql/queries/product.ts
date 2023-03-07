// Package modules
import {intArg, nonNull, queryField} from "nexus";

export const product = queryField("product", {
  type: "Product",
  args: {
    id: nonNull(intArg())
  },
  resolve: async (_root, { id }, ctx) => {
    const product = await ctx.db.product.findUnique({
      where: {
        id: id
      }
    });

    return product;
  },
});
