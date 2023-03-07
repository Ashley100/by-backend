// Package modules
import {enumType, intArg, nonNull, queryField, stringArg} from "nexus";

// Local modules
import {ProductsPayload} from "../types";
import {DATA_PROVIDER} from "../productService";

const DEFAULT_PRODUCTS_AMOUNT = 10;
const DEFAULT_SKIP_PRODUCTS_AMOUNT = 0;

export const products = queryField("products", {
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
    const filters = {
      skip,
      first,
      searchBy,
      filter
    };

    return await ctx.sdk.product.searchProducts(filters, DATA_PROVIDER.SQLITE);
  }
});
