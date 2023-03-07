// Package modules
import { PrismaClient } from "@prisma/client";
import { Role, UserRoles } from "nexus-prisma";
import type { ProductService } from "./graphql/productService";

export type User = {
  id: number;
  roles: UserRoles[];
  name: string;
  email: string;
} | null;

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  user: User,
  sdk: {
    product: ProductService
  }
};
