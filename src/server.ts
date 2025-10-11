import { Hono } from "hono";
import { pinoLogger } from "hono-pino";

import type { Environment } from "./bindings.js";

import categories from "./categories/categories.controller";
import jwtMiddleware from "./middlewares/jwt.js";
import { rateLimiter } from "./middlewares/rate-limiter.js";

const app = new Hono<Environment>().basePath("/api");

app
  .use(jwtMiddleware) // Apply JWT authentication middleware
  .use(pinoLogger()) // Log all requests
  .use(rateLimiter); // Apply rate limiting middleware

app
  .get("/", async (c) => {
    const payload = c.get("jwtPayload");
    if (payload) {
      return c.json({ message: `Welcome back` });
    }
    return c.json({ message: "Welcome to the API" });
  })
  .route("/categories", categories);

export default app;
