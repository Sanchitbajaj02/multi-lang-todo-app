import { Dependencies } from "@/container/di.container";
import CustomError from "@/lib/custom-error";
import { taskSchema } from "@/model/schema";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

export default class TaskService {
  private dbClient: any;
  constructor(private deps: Dependencies) {}

  getAllTasks = async () => {
    this.dbClient = await this.deps.databaseService.getConnection();

    const tasks = await this.dbClient.select().from(taskSchema);
    return tasks;
  };

  createTask = async (title: string, description: string) => {
    this.dbClient = await this.deps.databaseService.getConnection();

    await this.dbClient
      .insert(taskSchema)
      .values({
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
      })
      .execute();
  };

  deleteTask = async (id: string) => {
    this.dbClient = await this.deps.databaseService.getConnection();

    // check if task exists
    const task = await this.dbClient.select().from(taskSchema).where({ id });

    if (task.length === 0) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Task not found");
    }

    await this.dbClient.delete(taskSchema).where({ id }).execute();
  };

  toggleTask = async (id: string) => {
    this.dbClient = await this.deps.databaseService.getConnection();

    const task = await this.dbClient.select().from(taskSchema).where({ id });

    if (task.length === 0) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Task not found");
    }

    await this.dbClient
      .update(taskSchema)
      .set({ completed: !task[0].completed })
      .where({ id })
      .execute();

    return !task[0].completed;
  };
}
