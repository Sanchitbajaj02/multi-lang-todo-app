import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import TaskService from "@/services/task.service";

// Register services
container.register(TOKENS.TaskService, { useClass: TaskService });
