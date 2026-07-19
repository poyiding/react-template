/**
 * 稳定的前端权限码。
 * 真实项目中通常由后端下发字符串列表，前端用联合类型约束已知权限。
 */
export const ALL_PERMISSIONS = [
  "dashboard:view",
  "system:user:view",
  "system:user:create",
  "system:user:update",
  "system:user:delete",
  "system:role:view",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export type UserRole = "admin" | "user";

export type CurrentUser = {
  id: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
};

export type LoginFormValues = {
  username: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: CurrentUser;
};
