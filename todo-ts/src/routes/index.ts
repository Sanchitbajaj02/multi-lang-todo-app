import { Router } from "express";
import type { IRouter } from "express";
import taskRoutes from "@/routes/task.routes"
import { StatusCodes } from "http-status-codes";

const router: IRouter = Router();

// Health check
router.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
router.use("/task", taskRoutes);

export default router;
