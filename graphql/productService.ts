// Package modules
import { PrismaClient } from "@prisma/client";

// Local modules
import elastic from "../services/elastic";

export class ProductService {
  private index = "product_index";

  constructor(private readonly db: PrismaClient) {}

  async syncWithElastic(id: number) {
    if (!id) return null;

    const product = await this.db.product.findMany({
      where: {
        id
      }
    });

    if (!product) {
      return;
    }

    try {
      // Check product in elastic
    } catch(error) {
      // Create product in elastic

      return;
    }

    // Update product in elastic
  }
}