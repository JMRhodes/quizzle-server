import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { pinoLogger } from "hono-pino";
import { basicAuth } from "hono/basic-auth";

import type { Environment } from "./bindings.js";

import categories from "./categories/categories.controller";
import { rateLimiter } from "./middlewares/rate-limiter.js";

const app = new Hono<Environment>().basePath("/api");

app
  .use("*", async (c, next) => {
    const auth = basicAuth({
      username: c.env.USERNAME,
      password: c.env.PASSWORD,
      invalidUserMessage: {
        status: 401,
        message: "Unauthorized",
        hint: "Please provide valid credentials",
      },
    });
    await auth(c, next);
  }) // Apply basic authentication
  .use(pinoLogger()) // Log all requests
  .use(rateLimiter); // Apply rate limiting middleware

app
  .get("/", async (c) => {
    return c.json({ message: "Welcome to the API" });
  })
  .route("/categories", categories);

export default app;
