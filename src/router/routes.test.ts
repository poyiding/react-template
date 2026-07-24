import { describe, expect, it } from "vitest";

import { createAuthorizedLayoutRoute } from "@/router/routes";
import { ALL_PERMISSIONS, type Permission } from "@/types/auth";

describe("侧栏路由转换", () => {
  it("补全嵌套路由路径并保留隐藏路由元数据", () => {
    const route = createAuthorizedLayoutRoute(ALL_PERMISSIONS);
    const systemRoute = route?.routes?.find((item) => item.path === "/system");

    expect(systemRoute?.children?.map((item) => item.path)).toEqual([
      "/system/users",
      "/system/roles",
    ]);
    expect(route?.routes?.find((item) => item.path === "/403")?.hideInMenu).toBe(true);
  });

  it("viewer 菜单不包含角色管理", () => {
    const permissions: Permission[] = ["dashboard:view", "system:user:view"];
    const route = createAuthorizedLayoutRoute(permissions);
    const systemRoute = route?.routes?.find((item) => item.path === "/system");

    expect(systemRoute?.children?.map((item) => item.path)).toEqual(["/system/users"]);
  });
});
