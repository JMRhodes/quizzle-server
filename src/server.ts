import { Hono } from "hono";

import categories from "./categories/categories.controller";
import { rateLimit } from "./middlewares/rate-limiter.js";

const app = new Hono().basePath("/api");

app
  .use(rateLimit)
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/categories", categories);

export default app;
