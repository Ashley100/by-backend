// Package modules
import { PrismaClient } from "@prisma/client";
import type { ProductService } from "./graphql/productService";

type User = {
  id: number;
  role: string;
  name: string;
  email: string;
};

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  user: User,
  sdk: {
    product: ProductService
  }
};
