import type { Context, Next } from "hono";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema/index.js";

function withD1(c: Context, next: Next): Promise<Response | void> {
  if (!c.get("d1")) {
    const initDbConnect = () => drizzle(c.env.QUIZZLE_DB, { schema });

    c.set("db", initDbConnect());
  }

  return next();
}

export default withD1;
