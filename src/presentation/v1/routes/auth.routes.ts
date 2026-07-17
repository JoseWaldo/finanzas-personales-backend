import { Hono } from "hono";

import { authHandler } from "@/presentation/controllers/auth.controller";

const router = new Hono();

router.all("/auth/*", authHandler);

export default router;
