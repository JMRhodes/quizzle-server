import type { Context } from "hono";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { Environment } from "../bindings.js";

import { insertCategorySchema, updateCategorySchema } from "../db/schema/categories.js";
import { categoriesService } from "./categories.service";

const categories = new Hono<Environment>();

categories.get("/", async (c: Context<Environment>) => {
  const results = await categoriesService.getAllCategories(c);
  return Response.json(results);
});

categories.get("/:id", async (c) => {
  const { id } = c.req.param();
  const result = await categoriesService.getCategoryById(Number.parseInt(id), c);

  if (!result) {
    return c.json({ message: "Category not found" }, 404);
  }

  return c.json({ message: "Category found", category: result });
});

categories.post("/", zValidator("json", insertCategorySchema), async (c) => {
  const response = await categoriesService.createCategory(c.req.valid("json"), c);

  return c.json({ message: "Category created", response });
});

categories.put("/:id", zValidator("json", updateCategorySchema), async (c) => {
  const { id } = c.req.param();
  const response = await categoriesService.updateCategory(Number.parseInt(id), c.req.valid("json"), c);

  return c.json({ message: "Category updated", response });
});

categories.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const response = await categoriesService.deleteCategory(Number.parseInt(id), c);
  return c.json({ message: `Category ${id} deleted`, response });
});

export default categories;
