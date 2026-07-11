import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { BasicLayout } from "@/layouts/BasicLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/Login";
import { NotFoundPage } from "@/pages/NotFound";
import { RoleManagementPage } from "@/pages/System/RoleManagement";
import { UserManagementPage } from "@/pages/System/UserManagement";
import { ProtectedRoute } from "@/router/ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BasicLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="system">
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="roles" element={<RoleManagementPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
