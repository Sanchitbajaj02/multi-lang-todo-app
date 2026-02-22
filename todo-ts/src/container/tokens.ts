export const TOKENS = {
  // Core Services (Singletons)
  Logger: Symbol.for("Logger"),
  Config: Symbol.for("Config"),
  DrizzleClient: Symbol.for("DrizzleClient"),

  // Services
  TaskService: Symbol.for("TaskService"),

  // Factories
  ResponseFactory: Symbol.for("ResponseFactory"),
} as const;

export type TokenKey = keyof typeof TOKENS;
