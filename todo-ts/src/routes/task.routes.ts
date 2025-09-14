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

    this.router.delete("/:id/delete", this.taskController.deleteTask);

    this.router.patch("/:id/toggle", this.taskController.toggleTask);
  }
}