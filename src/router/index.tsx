import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { RouteLoading } from "@/components/RouteLoading";
import { ProtectedRoute } from "@/router/ProtectedRoute";

const BasicLayout = lazy(() =>
  import("@/layouts/BasicLayout").then((module) => ({ default: module.BasicLayout })),
);
const DashboardPage = lazy(() =>
  import("@/pages/Dashboard").then((module) => ({ default: module.DashboardPage })),
);
const LoginPage = lazy(() =>
  import("@/pages/Login").then((module) => ({ default: module.LoginPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFound").then((module) => ({ default: module.NotFoundPage })),
);
const RoleManagementPage = lazy(() =>
  import("@/pages/System/RoleManagement").then((module) => ({
    default: module.RoleManagementPage,
  })),
);
const UserManagementPage = lazy(() =>
  import("@/pages/System/UserManagement").then((module) => ({
    default: module.UserManagementPage,
  })),
);
const ForbiddenPage = lazy(() =>
  import("@/pages/Exception").then((module) => ({ default: module.ForbiddenPage })),
);
const ServerErrorPage = lazy(() =>
  import("@/pages/Exception").then((module) => ({ default: module.ServerErrorPage })),
);

function routeElement(Component: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Component />
    </Suspense>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AppErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/login" element={routeElement(LoginPage)} />
        <Route path="/" element={<ProtectedRoute>{routeElement(BasicLayout)}</ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={routeElement(DashboardPage)} />
          <Route path="system">
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={routeElement(UserManagementPage)} />
            <Route path="roles" element={routeElement(RoleManagementPage)} />
          </Route>
          <Route path="403" element={routeElement(ForbiddenPage)} />
          <Route path="500" element={routeElement(ServerErrorPage)} />
        </Route>
        <Route path="*" element={routeElement(NotFoundPage)} />
      </Routes>
    </AppErrorBoundary>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
