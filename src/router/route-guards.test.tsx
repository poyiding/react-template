import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Route, Routes, useLocation } from "react-router-dom";

import { AccessRoute } from "@/router/AccessRoute";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { useAuthStore } from "@/stores/auth.store";
import { renderApp } from "@/test/render";

function LoginTarget() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from;
  return <div>登录页，来源：{from?.pathname}</div>;
}

describe("路由守卫", () => {
  beforeEach(() => useAuthStore.getState().logout());

  it("匿名访问受保护页面时跳转登录并记录来源", async () => {
    renderApp(
      <Routes>
        <Route path="/login" element={<LoginTarget />} />
        <Route
          path="/private"
          element={
            <ProtectedRoute>
              <div>私有页面</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { initialEntries: ["/private"] },
    );

    expect(await screen.findByText("登录页，来源：/private")).toBeInTheDocument();
  });

  it("已登录但权限不足时跳转 403", async () => {
    useAuthStore.getState().login({
      token: "viewer-token",
      user: {
        id: "2",
        name: "viewer",
        permissions: ["system:user:view"],
        role: "user",
      },
    });

    renderApp(
      <Routes>
        <Route path="/403" element={<div>无权访问</div>} />
        <Route
          path="/roles"
          element={
            <AccessRoute access="system:role:view">
              <div>角色管理</div>
            </AccessRoute>
          }
        />
      </Routes>,
      { initialEntries: ["/roles"] },
    );

    expect(await screen.findByText("无权访问")).toBeInTheDocument();
  });
});
