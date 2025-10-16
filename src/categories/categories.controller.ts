import type { Context } from "hono";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { Environment, jsonApiErrorResponse, jsonApiListResponse, jsonApiResponse } from "../bindings";

import withD1 from "../db";
import { insertCategorySchema, updateCategorySchema } from "../db/schema/categories";
import { categoriesService } from "./categories.service";

const categories = new Hono<Environment>();

categories.get("/", withD1, async (c: Context<Environment>) => {
  const results = await categoriesService.getAllCategories(c);
  return c.json({
    data: results.map(category => ({
      type: "categories",
      id: category.id,
      attributes: { ...category, id: undefined },
    })),
  } as jsonApiListResponse);
});

categories.get("/:id", withD1, async (c) => {
  const { id } = c.req.param();
  const result = await categoriesService.getCategoryById(Number.parseInt(id), c);

  if (!result) {
    return c.json({
      id: "not_found",
      status: 404,
      errors: [{ detail: `Category with id ${id} not found` }],
      meta: {},
    } as jsonApiErrorResponse, 404);
  }

  return c.json({
    data: {
      type: "categories",
      id: result.id,
      attributes: { ...result, id: undefined },
    },
  } as jsonApiResponse);
});

categories.post("/", withD1, zValidator("json", insertCategorySchema), async (c) => {
  const response = await categoriesService.createCategory(c.req.valid("json"), c);

  return c.json({ message: "Category created", response });
});

categories.put("/:id", withD1, zValidator("json", updateCategorySchema), async (c) => {
  const { id } = c.req.param();
  const response = await categoriesService.updateCategory(Number.parseInt(id), c.req.valid("json"), c);

  return c.json({ message: "Category updated", response });
});

categories.delete("/:id", withD1, async (c) => {
  const { id } = c.req.param();
  const response = await categoriesService.deleteCategory(Number.parseInt(id), c);
  return c.json({ message: `Category ${id} deleted`, response });
});

export default categories;
