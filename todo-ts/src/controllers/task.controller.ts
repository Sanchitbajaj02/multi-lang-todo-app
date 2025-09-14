import { Dependencies } from "@/container/di.container";
import TaskService from "@/services/task.service";
import { Request, Response } from "express";

export default class TaskController {
  constructor(
    private taskService: TaskService,
    private deps: Dependencies
  ) {}

  getTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      this.deps.logger.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  };

  createTask = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    try {
      await this.taskService.createTask(title, description);
      res.status(201).json({ message: "Task created successfully" });
    } catch (error) {
      this.deps.logger.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    try {
      await this.taskService.deleteTask(id);
      res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (error: any) {
      this.deps.logger.error("Error deleting task:", error);
      res.status(500).json({ error: error.message || "Failed to delete task" });
    }
  };

  toggleTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    try {
      const currentStatus = await this.taskService.toggleTask(id);
      res.status(200).json({
        message: `Task has been marked as ${currentStatus ? "completed" : "incomplete"}`,
      });
    } catch (error) {
      this.deps.logger.error("Error toggling task:", error);
      res.status(500).json({ error: "Failed to toggle task" });
    }
  };
}
