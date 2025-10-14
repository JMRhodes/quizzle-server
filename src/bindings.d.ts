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

type jsonApiResponse = {
  data: {
    type: string;
    id: number;
    attributes: Record<string, unknown>;
  } | null;
  errors?: { detail: string }[];
  meta?: Record<string, unknown>;
};

type jsonApiListResponse = {
  data: {
    type: string;
    id: number;
    attributes: Record<string, unknown>;
  }[];
  errors?: { detail: string }[];
  meta?: Record<string, unknown>;
};

type jsonApiErrorResponse = {
  id: string;
  status: string;
  errors: { detail: string }[];
  meta?: Record<string, unknown>;
};
