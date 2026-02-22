import { container } from "tsyringe";
import TaskController from "@/controllers/task.controller";
import { Router } from "express";
import type { IRouter } from "express";

// Resolve controller from DI container
const taskController = container.resolve(TaskController);

const router: IRouter = Router();

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.delete("/:taskId/delete", taskController.deleteTask);
router.patch("/:taskId/toggle", taskController.toggleTask);

export default router;