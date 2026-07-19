import type { ReactNode } from "react";

import { useAccess } from "@/hooks/useAccess";
import type { Permission } from "@/types/auth";

type AccessProps = {
  /** 需要的权限；数组时默认满足任一即可。 */
  permission: Permission | Permission[];
  /** 数组权限的匹配模式，默认 any。 */
  mode?: "any" | "all";
  /** 无权限时的占位内容，默认不渲染。 */
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * 按钮/区块级权限控制。仅控制 UI 展示，不能替代服务端鉴权。
 */
export function Access({ permission, mode = "any", fallback = null, children }: AccessProps) {
  const access = useAccess();
  const required = Array.isArray(permission) ? permission : [permission];
  const allowed = mode === "all" ? access.canAll(required) : access.canAny(required);

  if (!allowed) {
    return fallback;
  }

  return children;
}
