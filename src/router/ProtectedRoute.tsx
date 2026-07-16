import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

type ProtectedRouteProps = {
  children: ReactNode;
};

/**
 * 登录状态守卫。
 * 存在 Token 时渲染目标页面，否则跳转到登录页并记录原访问位置，
 * 以便登录成功后返回该页面。
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
