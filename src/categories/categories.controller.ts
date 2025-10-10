import type { Context } from "hono";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import type { Environment } from "../bindings.js";

import { initDbConnect } from "../db/index.js";
import { categories as categoriesTable } from "../db/schema/categories.js";
import { CategorySchema } from "./categories.types";

const categories = new Hono<Environment>();

categories.get("/", async (c: Context<Environment>) => {
  const db = initDbConnect(c.env.QUIZZLE_DB);
  const result = await db.select().from(categoriesTable);

  return Response.json(result);
});

categories.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.text(`Category ID: ${id}`);
});

categories.post("/", async (c) => {
  // const db = initDbConnect(c.env.DB);
  // console.log("DB Object:", db);
  // const category = {
  //   name: "test",
  //   slug: "test",
  //   description: "",
  //   isActive: true,
  //   displayOrder: 0,
  // };
  // const response = await db.insert(categoriesTable).values(category);
  // return c.json({ message: "Category created", response });
});

categories.put("/:id", zValidator("json", CategorySchema), (c) => {
  const { id } = c.req.param();
  const category = c.req.valid("json");
  return c.json({ message: `Category ${id} updated`, category });
});

categories.delete("/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ message: `Category ${id} deleted` });
});

export default categories;
