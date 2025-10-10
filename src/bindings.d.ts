import type { Env } from "hono";

type Environment = Env & {
  Bindings: {
    JWT_SECRET: string;
    USERNAME: string;
    PASSWORD: string;
    QUIZZLE_DB: D1Database;
    NODE_ENV: "development" | "production";
  };
};
