import { container } from "tsyringe";

// Import registries in order (singletons first, then factories, then services)
import "./singleton.registry";
import "./factory.registry";
import "./service.registry";

// Export container and tokens for use throughout the application
export { container };
export { TOKENS } from "./tokens";
