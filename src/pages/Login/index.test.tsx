import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";

import { LoginPage } from "@/pages/Login";
import { useAuthStore } from "@/stores/auth.store";
import { renderApp } from "@/test/render";

describe("登录主链路", () => {
  beforeEach(() => useAuthStore.getState().logout());

  it("登录成功后保存会话并返回原页面", async () => {
    const user = userEvent.setup();
    renderApp(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/system/users" element={<div>用户管理页</div>} />
      </Routes>,
      {
        initialEntries: [
          {
            pathname: "/login",
            state: { from: { pathname: "/system/users", search: "?page=2" } },
          },
        ],
      },
    );

    await user.type(screen.getByLabelText("用户名"), "viewer");
    await user.type(screen.getByLabelText("密码"), "any");
    await user.click(screen.getByRole("button", { name: /登\s*录/ }));

    expect(await screen.findByText("用户管理页")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBe("mock-token-viewer");
  });
});
