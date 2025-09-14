import TaskController from "@/controllers/task.controller";
import { Router } from "express";

export default class TodoRouter {
  public router = Router();

  constructor(private taskController: TaskController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Define your routes here
    this.router.get("/", this.taskController.getTasks);

    this.router.post("/", this.taskController.createTask);

    this.router.delete("/:taskId/delete", this.taskController.deleteTask);

    this.router.patch("/:taskId/toggle", this.taskController.toggleTask);
  }
}