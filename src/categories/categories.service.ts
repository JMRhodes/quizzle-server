import type { Context } from "hono";
import type { z } from "zod";

import { eq } from "drizzle-orm";

import type { Environment } from "../bindings";
import type { insertCategorySchema, selectCategorySchema, updateCategorySchema } from "../db/schema/categories";

import { initDbConnect } from "../db/index";
import { categories as categoriesTable } from "../db/schema/categories";

export const categoriesService = {
  getAllCategories: async (c: Context<Environment>): Promise<z.infer<typeof selectCategorySchema>[]> => {
    try {
      const db = initDbConnect(c.env.QUIZZLE_DB);
      const result = await db.select().from(categoriesTable);
      return result as z.infer<typeof selectCategorySchema>[];
    }
    catch (error) {
      throw new Error("Failed to fetch categories", { cause: error });
    }
  },
  getCategoryById: async (id: number, c: Context<Environment>): Promise<z.infer<typeof selectCategorySchema>> => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const result = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);

    return result[0] as z.infer<typeof selectCategorySchema>;
  },
  createCategory: async (categoryData: z.infer<typeof insertCategorySchema>, c: Context<Environment>) => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const response = await db.insert(categoriesTable).values(categoryData);
    return response;
  },
  updateCategory: async (id: number, categoryData: Partial<z.infer<typeof updateCategorySchema>>, c: Context<Environment>) => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const response = await db.update(categoriesTable).set(categoryData).where(eq(categoriesTable.id, id));
    return response;
  },
  deleteCategory: async (id: number, c: Context<Environment>) => {
    const db = initDbConnect(c.env.QUIZZLE_DB);
    const response = await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    return response;
  },
};
