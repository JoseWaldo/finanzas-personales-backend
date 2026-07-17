import type { Context } from "hono";

import { auth } from "@/infrastructure/auth/better-auth";

export async function authHandler(c: Context) {
  return auth.handler(c.req.raw);
}
