import { Router } from "express";
import type { IRouter } from "express";
import { container } from "tsyringe";
import TaskController from "@/controllers/task.controller";

const router: IRouter = Router();

// Resolve controller from DI container
const taskController = container.resolve(TaskController);

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.delete("/:taskId/delete", taskController.deleteTask);
router.patch("/:taskId/toggle", taskController.toggleTask);

export default router;
