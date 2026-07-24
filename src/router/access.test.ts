import { describe, expect, it } from "vitest";

import { canAccess, filterMenuByAccess, hasAllPermissions } from "@/router/access";
import type { Permission } from "@/types/auth";

describe("路由权限", () => {
  const viewerPermissions: Permission[] = ["dashboard:view", "system:user:view"];

  it("按单个或多个权限判断访问", () => {
    expect(canAccess(viewerPermissions, "dashboard:view")).toBe(true);
    expect(canAccess(viewerPermissions, ["system:role:view", "system:user:view"])).toBe(true);
    expect(canAccess(viewerPermissions, "system:role:view")).toBe(false);
    expect(hasAllPermissions(viewerPermissions, ["dashboard:view", "system:user:view"])).toBe(true);
  });

  it("过滤无权菜单，并在子菜单为空时移除父菜单", () => {
    const menu = [
      {
        name: "系统管理",
        children: [{ name: "角色管理", access: "system:role:view" as Permission }],
      },
      { name: "工作台", access: "dashboard:view" as Permission },
    ];

    expect(filterMenuByAccess(menu, viewerPermissions)).toEqual([
      { name: "工作台", access: "dashboard:view", children: undefined },
    ]);
  });
});
