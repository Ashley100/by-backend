// Package modules
import { Prisma, PrismaClient } from "@prisma/client";
import { ApolloError } from "apollo-server";

// Local modules
import elastic from "../services/elastic";
import { ROLES } from "../utils/constants";
import { User } from '../context';

export const enum DATA_PROVIDER {
  ELASTIC = "ELASTIC",
  SQLITE = "SQLITE",
}

type DataProvider = keyof typeof DATA_PROVIDER;

type SearchByType = string | null | undefined;

type SearchFiltersType = {
  skip?: number,
  first?: number,
  searchBy?: SearchByType,
  filter?: "active" | "all" | null | undefined // Currently filtering only by the "active" field. Can be expanded.
};

export class ProductService {
  private index = "product_index";

  isAdmin;

  public ELASTIC_PROVIDER = DATA_PROVIDER.ELASTIC;
  public SQLITE_PROVIDER = DATA_PROVIDER.SQLITE;

  constructor(
    private readonly db: PrismaClient,
    private readonly user?: User
  ) {
    this.isAdmin = user?.role === ROLES.ADMIN;
  }

  async searchProducts(
    filters: SearchFiltersType,
    provider: DataProvider = DATA_PROVIDER.SQLITE
  ) {
    let products = {};

    try {
      switch (provider) {
        case DATA_PROVIDER.ELASTIC: {
          products = await this.searchInElastic(filters);
          break;
        }
        default: {
          products = await this.searchLocal(filters);
          break;
        }
      }

    } catch(error) {
      throw new ApolloError("Something went wrong!");
    }

    return products;
  }

  async searchLocal({ searchBy, skip, first, filter }: SearchFiltersType) {
    const searchOrQuery: Prisma.Enumerable<Prisma.ProductWhereInput> = searchBy
      ? searchBy.split(" ").map((word) => ({
        OR: [
          { title: { contains: word } },
          { description: { contains: word } },
        ],
      }))
      : {};

    const searchByFilter: Prisma.ProductWhereInput = searchOrQuery
      ? { AND: searchOrQuery }
      : {};

    // User can view only active pruducts
    let activeFilter: Prisma.ProductWhereInput = { active: true };

    // Admin can view both only active or all products 
    if (this.isAdmin) {
      activeFilter = filter !== "all"
        ? { active: !!filter }
        : {};
    }

    const where: Prisma.ProductWhereInput = {
      ...searchByFilter,
      ...activeFilter
    };

    const data = await this.db.product.findMany({ take: first, skip, where });
    const count = await this.db.product.count({ where });

    return {
      count,
      data,
      hasMore: (first && skip) ? first + skip <= count : 0
    }

  }

  async searchInElastic({ searchBy, skip, first, filter }: SearchFiltersType) {
    const filters: [object] = [{
      query_string: {
        query: `*${searchBy}*`,
        fields: ['title', 'description']
      }
    }];

    // Admin can view both only active or all products
    if (this.isAdmin) {
      if (filter !== "all") {
        filters.push({
          match: {
            active: !!filter
          }
        });
      }
    // User can view only active pruducts
    } else {
      filters.push({
        match: {
          active: true
        }
      });
    }

    const where = {
      from: skip,
      size: first,
      index: this.index,
      body: {
        query: {
          bool: {
            filter: filters
          }
        }
      }
    };

    try {
      const { body } = await elastic.search(where);
      
      const data = body.hits.hits.map((hit: any) => hit._source);
      const count = body?.hits?.total?.value ?? 0;

      return {
        count,
        data,
        hasMore: (first && skip) ? first + skip <= body.hits.total : false
      };

    } catch(e) {
      throw new ApolloError("Something went wrong!");
    }
  }

  async syncWithElastic(id: number) {
    if (!id) return null;

    const product = await this.db.product.findUnique({
      where: {
        id
      }
    });

    if (!product) {
      return;
    }

    try {
      // Check product in elastic
      await elastic.get({ id: String(product.id), index: this.index });
    } catch(error) {
      if (error?.meta?.body?.found === false) {
        // Create product in elastic
        await elastic.create({
          index: this.index,
          id: String(product.id),
          refresh: true,
          body: product
        });
      }
      return;
    }

    // Update product in elastic
    await elastic.update({
      index: this.index,
      id: String(product.id),
      refresh: true,
      body: product
    });
  }
}