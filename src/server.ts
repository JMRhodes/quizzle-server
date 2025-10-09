import { Hono } from "hono";
import { pinoLogger } from "hono-pino";
import { basicAuth } from "hono/basic-auth";

import categories from "./categories/categories.controller";
import { rateLimiter } from "./middlewares/rate-limiter.js";

type Bindings = {
  USERNAME: string;
  PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app
  .use("*", async (c, next) => {
    const auth = basicAuth({
      username: c.env.USERNAME,
      password: c.env.PASSWORD,
    });
    await auth(c, next);
  }) // Apply basic authentication
  .use(pinoLogger()) // Log all requests
  .use(rateLimiter); // Apply rate limiting middleware

app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/categories", categories);

export default app;
