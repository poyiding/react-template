import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { canAccess } from "@/router/access";
import { useAuthStore } from "@/stores/auth.store";
import type { Permission } from "@/types/auth";

type AccessRouteProps = {
  access?: Permission | Permission[];
  children: ReactNode;
};

/**
 * 页面级权限守卫。已登录但缺少路由声明的权限时进入 403。
 */
export function AccessRoute({ access, children }: AccessRouteProps) {
  const permissions = useAuthStore((state) => state.user?.permissions);

  if (!canAccess(permissions, access)) {
    return <Navigate replace to="/403" />;
  }

  return children;
}
