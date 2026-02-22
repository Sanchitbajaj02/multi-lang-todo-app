import { TOKENS } from "@/container/tokens";
import type { ILoggerService } from "@/logger/logger.service";
import TaskService from "@/services/task.service";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./base.controller";
import type { IResponseFactory } from "@/factories/response.factory";
import asyncHandler from "@/lib/async-handler";

@injectable()
export default class TaskController extends BaseController {
  constructor(
    @inject(TOKENS.TaskService) private taskService: TaskService,
    @inject(TOKENS.Logger) logger: ILoggerService,
    @inject(TOKENS.ResponseFactory) responseFactory: IResponseFactory
  ) {
    super(logger, responseFactory);
  }

  getTasks = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await this.taskService.getAllTasks();
    res.status(200).json(tasks);
  });

  createTask = asyncHandler(async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    await this.taskService.createTask(title, description);
    res.status(201).json({ message: "Task created successfully" });
  });

  deleteTask = asyncHandler(async (req: Request, res: Response) => {
    let { taskId } = req.params;
    if (Array.isArray(taskId)) taskId = taskId[0];

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    await this.taskService.deleteTask(taskId);
    res.status(200).json({
      message: "Task deleted successfully",
    });
  });

  toggleTask = asyncHandler(async (req: Request, res: Response) => {
    let { taskId } = req.params;
    if (Array.isArray(taskId)) taskId = taskId[0];

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const currentStatus = await this.taskService.toggleTask(taskId);
    res.status(200).json({
      message: `Task has been marked as ${currentStatus ? "completed" : "incomplete"}`,
    });
  });
}
