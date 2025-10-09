import { Hono } from "hono";

import categories from "./categories/categories.controller";

const app = new Hono().basePath("/api");

app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/categories", categories);

export default app;
