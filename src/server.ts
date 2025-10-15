import { Hono } from "hono";
import { pinoLogger } from "hono-pino";
import { showRoutes } from "hono/dev";

import type { Environment } from "./bindings";

import categories from "./categories/categories.controller";
import health from "./health/health.controller";
import jwtMiddleware from "./middlewares/jwt";
import { rateLimiter } from "./middlewares/rate-limiter";
import questions from "./questions/questions.controller";

const app = new Hono<Environment>().basePath("/api");

app
  .use(jwtMiddleware) // Apply JWT authentication middleware
  .use(pinoLogger()) // Log all requests
  .use(rateLimiter) // Apply rate limiting middleware
  .use(async (c, next) => {
    if (c.env.NODE_ENV === "development") {
      const { logger } = c.var;
      logger.debug(c.env);
      showRoutes(app);
    }

    await next();
  });

app
  .get("/", async (c) => {
    const payload = c.get("jwtPayload");
    if (payload) {
      return c.json({ message: `Welcome back` });
    }
    return c.json({ message: "Welcome to the API" });
  })
  .route("/health", health)
  .route("/categories", categories)
  .route("/questions", questions);

export default app;
