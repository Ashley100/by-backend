// Package modules
import {objectType} from "nexus";

export const ProductsPayload = objectType({
  name: "ProductsPayload",
  definition(t) {
    t.int("count");
    t.list.field("data", { type: "Product" });
    t.boolean("hasMore");
  },
});
