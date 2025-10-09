import { Hono } from "hono";
import { pinoLogger } from "hono-pino";

import categories from "./categories/categories.controller";
import { rateLimiter } from "./middlewares/rate-limiter.js";

const app = new Hono().basePath("/api");

app
  .use(pinoLogger()) // Log all requests
  .use(rateLimiter); // Apply rate limiting middleware

app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/categories", categories);

export default app;
