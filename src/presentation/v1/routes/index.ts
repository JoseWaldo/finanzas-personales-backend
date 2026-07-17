import { Hono } from "hono";

import healthRoutes from "@/presentation/v1/routes/health.routes";
import authRoutes from "@/presentation/v1/routes/auth.routes";

const router = new Hono();

router.route("/health", healthRoutes);
router.route("/", authRoutes);

export default router;
