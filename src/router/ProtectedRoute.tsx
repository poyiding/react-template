import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
// import { clearSession } from "@/utils/session";

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
  // const permissions = useAuthStore((state) => state.user?.permissions);

  const loginState = {
    from: {
      pathname: location.pathname,
      search: location.search,
    },
  };

  if (!token) {
    return <Navigate replace to="/login" state={loginState} />;
  }

  // // 兼容升级前缺少 permissions 的本地会话，强制重新登录。
  // if (!Array.isArray(permissions)) {
  //   clearSession();
  //   return <Navigate replace to="/login" state={loginState} />;
  // }

  return children;
}
