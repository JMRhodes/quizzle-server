import type { Context } from "hono";

import { Hono } from "hono";

import type { Environment, jsonApiResponse } from "../bindings";

const health = new Hono<Environment>();

health.get("/", (c: Context<Environment>) => {
  return c.json({
    data: {
      type: "healthCheck",
      id: 200,
      attributes: {
        status: "UP",
      },
    },
  } as jsonApiResponse);
});

export default health;
