// Package modules
import { ApolloError } from "apollo-server";
import {
  nonNull,
  booleanArg,
  stringArg,
  intArg,
  mutationField,
  nullable
} from "nexus";

export const createProduct = mutationField("createProduct", {
  type: "Product",
  args: {
    title: nonNull(stringArg()),
    description: nonNull(stringArg()),
    category: nonNull(stringArg()),
    color: nonNull(stringArg()),
    active: nonNull(booleanArg()),
    ownerId: nonNull(intArg())
  },
  resolve: async (_root, {
    title,
    description,
    category,
    color,
    active,
    ownerId
  }, ctx) => {
    const data = {
      data: {
        title,
        description,
        category,
        color,
        active,
        owner: {
          connect: {
            id: ownerId
          }
        },
      },
    };

    try {
      const product = await ctx.db.product.create(data);
      ctx.sdk.product.syncWithElastic(product.id);
      
      return product;
    } catch(error) {
      throw new ApolloError("Something went wrong!");
    }
    
  }
});
