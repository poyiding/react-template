import type { MenuDataItem } from "@ant-design/pro-components";

import type { Permission } from "@/types/auth";

type Accessible = {
  access?: Permission | Permission[];
  children?: Accessible[];
};

function toPermissionList(access: Permission | Permission[]): Permission[] {
  return Array.isArray(access) ? access : [access];
}

/** 是否拥有指定权限码。 */
export function hasPermission(
  permissions: readonly Permission[] | undefined,
  permission: Permission,
): boolean {
  return Boolean(permissions?.includes(permission));
}

/** 是否拥有任一权限码。 */
export function hasAnyPermission(
  permissions: readonly Permission[] | undefined,
  required: readonly Permission[],
): boolean {
  if (!permissions?.length || !required.length) {
    return false;
  }

  return required.some((permission) => permissions.includes(permission));
}

/** 是否拥有全部权限码。 */
export function hasAllPermissions(
  permissions: readonly Permission[] | undefined,
  required: readonly Permission[],
): boolean {
  if (!permissions?.length || !required.length) {
    return false;
  }

  return required.every((permission) => permissions.includes(permission));
}

/**
 * 判断当前权限是否满足路由/菜单上的 access 声明。
 * 未声明 access 时视为仅需登录即可访问。
 */
export function canAccess(
  permissions: readonly Permission[] | undefined,
  access?: Permission | Permission[],
): boolean {
  if (!access) {
    return true;
  }

  return hasAnyPermission(permissions, toPermissionList(access));
}

/**
 * 按权限过滤菜单树。父节点在未声明 access 时，仅当仍有可见子节点时保留。
 */
export function filterMenuByAccess<T extends Accessible>(
  items: T[],
  permissions: readonly Permission[] | undefined,
): T[] {
  return items.flatMap((item) => {
    if (!canAccess(permissions, item.access)) {
      return [];
    }

    const children = item.children ? filterMenuByAccess(item.children, permissions) : undefined;

    if (item.children && (!children || children.length === 0)) {
      return [];
    }

    return [
      {
        ...item,
        children,
      },
    ];
  });
}

export type MenuItemWithAccess = MenuDataItem & {
  access?: Permission | Permission[];
};
