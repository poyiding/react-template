import type { AxiosError } from "axios";
import { http as mswHttp, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { http, shouldClearSession } from "@/api/http";
import { queryClient } from "@/app/query-client";
import { useAuthStore } from "@/stores/auth.store";
import { server } from "@/test/server";
import { appEnv } from "@/utils/env";

describe("HTTP 与 Query 策略", () => {
  beforeEach(() => useAuthStore.getState().logout());

  it("请求时注入当前 Token", async () => {
    let authorization: string | null = null;
    const url = `${appEnv.apiBaseUrl.replace(/\/$/, "")}/test-token`;
    server.use(
      mswHttp.get(url, ({ request }) => {
        authorization = request.headers.get("Authorization");
        return HttpResponse.json({ data: true });
      }),
    );
    useAuthStore.getState().login({
      token: "test-token",
      user: { id: "1", name: "admin", permissions: [], role: "admin" },
    });

    await http.get("/test-token");

    expect(authorization).toBe("Bearer test-token");
  });

  it("业务接口 401 清会话，登录接口 401 保留错误反馈", () => {
    const unauthorized = {
      config: { url: "/list/user" },
      response: { status: 401 },
    } as AxiosError;
    const loginRejected = {
      config: { url: "/auth/login" },
      response: { status: 401 },
    } as AxiosError;

    expect(shouldClearSession(unauthorized)).toBe(true);
    expect(shouldClearSession(loginRejected)).toBe(false);
  });

  it("Query 和 Mutation 默认不重试", () => {
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(false);
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false);
  });
});
