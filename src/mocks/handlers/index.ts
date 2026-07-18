import { authHandlers } from "./auth";
import { userHandlers } from "./users";

export const handlers = [...authHandlers, ...userHandlers];
