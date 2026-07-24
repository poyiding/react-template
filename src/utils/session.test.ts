import { beforeEach, describe, expect, it } from "vitest";

import { queryClient } from "@/app/query-client";
import { useAuthStore } from "@/stores/auth.store";
import { clearSession } from "@/utils/session";

describe("退出清理", () => {
  beforeEach(() => {
    queryClient.clear();
    useAuthStore.getState().logout();
  });

  it("同时清除登录信息和 Query 缓存", () => {
    useAuthStore.getState().login({
      token: "test-token",
      user: { id: "1", name: "admin", permissions: [], role: "admin" },
    });
    queryClient.setQueryData(["usersList"], [{ id: "1" }]);

    clearSession();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(queryClient.getQueryData(["usersList"])).toBeUndefined();
  });
});
