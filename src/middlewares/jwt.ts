import type { Context, Next } from "hono";

import { jwt } from "hono/jwt";

import type { Environment } from "../bindings.js";

function jwtMiddleware(c: Context<Environment>, next: Next) {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: "HS256",
  });
  return jwtMiddleware(c, next);
}

export default jwtMiddleware;
