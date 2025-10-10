import type { Context } from "hono";

import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import type { Environment } from "../bindings.js";

import { initDbConnect } from "../db/index.js";
import { categories as categoriesTable, insertCategorySchema, updateCategorySchema } from "../db/schema/categories.js";

const categories = new Hono<Environment>();

categories.get("/", async (c: Context<Environment>) => {
  const db = initDbConnect(c.env.QUIZZLE_DB);
  const result = await db.select().from(categoriesTable);

  return Response.json(result);
});

categories.get("/:id", async (c) => {
  const { id } = c.req.param();
  const db = initDbConnect(c.env.QUIZZLE_DB);
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.id, Number.parseInt(id)));

  if (result.length === 0) {
    return c.json({ message: "Category not found" }, 404);
  }

  return c.json({ message: "Category found", category: result[0] });
});

categories.post("/", zValidator("json", insertCategorySchema), async (c) => {
  const db = initDbConnect(c.env.QUIZZLE_DB);
  const category = c.req.valid("json");
  const response = await db.insert(categoriesTable).values(category);

  return c.json({ message: "Category created", response });
});

categories.put("/:id", zValidator("json", updateCategorySchema), async (c) => {
  const { id } = c.req.param();
  const category = c.req.valid("json");
  const db = initDbConnect(c.env.QUIZZLE_DB);
  const response = await db.update(categoriesTable).set(category).where(eq(categoriesTable.id, Number.parseInt(id)));

  return c.json({ message: "Category updated", response });
});

categories.delete("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `Category ${id} deleted` });
});

export default categories;
