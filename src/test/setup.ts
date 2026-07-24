import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "@/test/server";

/**
 * Vitest 全局初始化：
 * 补齐 Ant Design 在 DOM 测试中依赖的浏览器 API，并统一管理 MSW 与测试清理。
 */
class ResizeObserverMock implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// 未声明的网络请求直接报错，确保测试不会意外访问真实后端或公网。
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  // 隔离组件 DOM、本地会话、临时 Handler 和 Mock，避免测试之间互相污染。
  cleanup();
  localStorage.clear();
  server.resetHandlers();
  vi.restoreAllMocks();
});

afterAll(() => server.close());
