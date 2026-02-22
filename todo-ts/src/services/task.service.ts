import CustomError from "@/lib/custom-error";
import { taskSchema } from "@/model/schema";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { BaseService } from "./base.service";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/container/tokens";
import type { IDrizzleService } from "@/databases/drizzle.service";
import type { ILoggerService } from "@/logger/logger.service";
import { eq } from "drizzle-orm";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed?: boolean | null;
}

export interface ITaskService {
  getAllTasks(): Promise<Task[]>;
  createTask(title: string, description?: string | null): Promise<void>;
  deleteTask(id: string): Promise<void>;
  toggleTask(id: string): Promise<boolean>;
}

@injectable()
export default class TaskService extends BaseService implements ITaskService {
  constructor(
    @inject(TOKENS.Logger) logger: ILoggerService,
    @inject(TOKENS.DrizzleClient) databaseService: IDrizzleService
  ) {
    super(logger, databaseService);
  }

  getAllTasks = async (): Promise<Task[]> => {
    const tasks = (await this.db.select().from(taskSchema)) as Task[];
    console.log("tasks::", tasks);
    return tasks;
  };

  createTask = async (title: string, description?: string | null): Promise<void> => {
    await this.db
      .insert(taskSchema)
      .values({
        id: crypto.randomUUID(),
        title,
        description: description ?? null,
        completed: false,
      })
      .execute();
  };

  deleteTask = async (id: string) => {
    // check if task exists
    const task = (await this.db
      .select()
      .from(taskSchema)
      .where(eq(taskSchema.id, id))) as Task[];

    if (task.length === 0) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Task not found");
    }

    await this.db.delete(taskSchema).where(eq(taskSchema.id, id)).execute();
  };

  toggleTask = async (id: string): Promise<boolean> => {
    const task = (await this.db
      .select()
      .from(taskSchema)
      .where(eq(taskSchema.id, id))) as Task[];

    if (task.length === 0) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Task not found");
    }

    const existing = task[0]!;
    const currentCompleted = Boolean(existing.completed);
    const newCompleted = !currentCompleted;

    await this.db
      .update(taskSchema)
      .set({ completed: newCompleted })
      .where(eq(taskSchema.id, id))
      .execute();

    return newCompleted;
  };
}
