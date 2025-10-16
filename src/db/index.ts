import type { Context, Next } from "hono";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema/index.js";

export default function withD1(c: Context, next: Next): Promise<Response | void> {
  if (!c.get("d1")) {
    const initDbConnect = (env: D1Database) => drizzle(env, { schema });

    c.set("d1", initDbConnect);
  }

  return next();
}
