import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { ResponseFactory } from "@/factories/response.factory";

// Register factories
container.register(TOKENS.ResponseFactory, { useClass: ResponseFactory });
