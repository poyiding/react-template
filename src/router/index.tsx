import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";

import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { RouteMetadataSync } from "@/router/RouteMetadataSync";
import { appRouterRoutes } from "@/router/routes";

function AppRoutes() {
  const location = useLocation();
  const routes = useRoutes(appRouterRoutes);

  return (
    <>
      <RouteMetadataSync />
      <AppErrorBoundary key={location.pathname}>{routes}</AppErrorBoundary>
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
