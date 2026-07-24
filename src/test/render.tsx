import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";

import { appTheme } from "@/app/theme";

type AppRenderOptions = Omit<RenderOptions, "wrapper"> & {
  initialEntries?: MemoryRouterProps["initialEntries"];
  queryClient?: QueryClient;
};

/** 为每次测试创建独立缓存，禁止失败状态重试，避免跨测试共享 Query 数据。 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
}

/**
 * 使用项目真实的主题、Ant Design App、Query 和内存路由 Provider 渲染组件。
 * 可传入 initialEntries 测试跳转，也可注入 QueryClient 检查缓存变化。
 */
export function renderApp(
  ui: ReactElement,
  {
    initialEntries = ["/"],
    queryClient = createTestQueryClient(),
    ...options
  }: AppRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ConfigProvider theme={appTheme}>
        <AntdApp>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </QueryClientProvider>
        </AntdApp>
      </ConfigProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
