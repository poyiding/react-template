import { canAccess, hasAllPermissions, hasAnyPermission, hasPermission } from "@/router/access";
import { useAuthStore } from "@/stores/auth.store";
import type { Permission } from "@/types/auth";

/**
 * 读取当前用户权限，并提供与路由/菜单相同的判断函数。
 */
export function useAccess() {
  const permissions = useAuthStore((state) => state.user?.permissions) ?? [];

  return {
    permissions,
    can: (permission: Permission) => hasPermission(permissions, permission),
    canAny: (required: readonly Permission[]) => hasAnyPermission(permissions, required),
    canAll: (required: readonly Permission[]) => hasAllPermissions(permissions, required),
    canAccess: (access?: Permission | Permission[]) => canAccess(permissions, access),
  };
}
