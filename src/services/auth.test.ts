import { http as mswHttp, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { login } from "@/services/auth";
import { server } from "@/test/server";
import { appEnv } from "@/utils/env";

const loginUrl = `${appEnv.apiBaseUrl.replace(/\/$/, "")}/auth/login`;

describe("登录 Service", () => {
  it("复用 MSW handler 返回演示账号会话", async () => {
    const result = await login({ password: "any", username: "viewer" });

    expect(result.token).toBe("mock-token-viewer");
    expect(result.user.permissions).toEqual(["dashboard:view", "system:user:view"]);
  });

  it("保留后端业务错误信息", async () => {
    server.use(
      mswHttp.post(loginUrl, () =>
        HttpResponse.json({ message: "账号或密码错误" }, { status: 401 }),
      ),
    );

    await expect(login({ password: "wrong", username: "admin" })).rejects.toThrow("账号或密码错误");
  });

  it("网络异常时返回可理解的兜底错误", async () => {
    server.use(mswHttp.post(loginUrl, () => HttpResponse.error()));

    await expect(login({ password: "any", username: "admin" })).rejects.toThrow(
      "登录失败，请稍后重试",
    );
  });
});
