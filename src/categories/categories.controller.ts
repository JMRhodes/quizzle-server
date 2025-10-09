import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { CategorySchema } from "./categories.types";

const categories = new Hono();

categories.get("/", (c) => {
  return c.text("Categories endpoint");
});

categories.get("/:id", (c) => {
  const { id } = c.req.param();
  return c.text(`Category ID: ${id}`);
});

categories.post("/", zValidator("json", CategorySchema), (c) => {
  const category = c.req.valid("json");
  return c.json({ message: "Category created", category }, 201);
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
