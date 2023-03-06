// Package modules
import { ApolloServer } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";

// Local modules
import { schema } from "./schema";
import { db } from "./db";
import { Context } from "./context";
import { permissions } from "./middleware/permissions";
import { ProductService } from "./graphql/productService";

export const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: async ({ req }): Promise<Context> => {
    // A simple way to track user data
    const user = await db.user.findUnique({
      where: {
        id: Number(req.headers?.userid)
      }
    });

    return <Context>{
      db,
      user,
      // HACK: Find why it's not working
      prisma: db,
      sdk: {
        product: new ProductService(db, user)
      }
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
