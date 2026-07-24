import { setupServer } from "msw/node";

import { handlers } from "@/mocks/handlers";

/**
 * Node 测试环境使用的 MSW Server。
 * 默认复用开发环境 Handler，单个测试可通过 server.use 临时覆盖特定场景。
 */
export const server = setupServer(...handlers);
