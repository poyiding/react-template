import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";

import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { RouteMetadataSync } from "@/router/RouteMetadataSync";
import { appRouterRoutes } from "@/router/routes";

function RouterShell() {
  const location = useLocation();

  return (
    <>
      <RouteMetadataSync />
      <AppErrorBoundary key={location.pathname}>
        <Outlet />
      </AppErrorBoundary>
    </>
  );
}

const router = createBrowserRouter([
  {
    children: appRouterRoutes,
    element: <RouterShell />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
