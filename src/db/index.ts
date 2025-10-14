import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema/index.js";

export const initDbConnect = (env: D1Database) => drizzle(env, { schema });
