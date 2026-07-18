import { Hono } from "hono";

import healthRoutes from "@/presentation/v1/routes/health.routes";
import authRoutes from "@/presentation/v1/routes/auth.routes";
import { authMiddleware } from "@/presentation/v1/middlewares/auth.middleware";

const router = new Hono();

router.route("/health", healthRoutes);
router.route("/", authRoutes);

router.get("/profile", authMiddleware, (c) => {
  return c.json({ user: c.get("user") });
});

export default router;
