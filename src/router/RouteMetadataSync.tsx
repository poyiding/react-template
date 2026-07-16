import { useEffect } from "react";
import { matchRoutes, useLocation } from "react-router-dom";

import { appRouterRoutes, type RouteHandle } from "@/router/routes";
import { appEnv } from "@/utils/env";

/**
 * 监听当前路由变化，并将匹配路由的标题同步到浏览器文档标题。
 * 该组件不渲染任何界面，应挂载在路由上下文内部。
 */
export function RouteMetadataSync() {
  const location = useLocation();

  useEffect(() => {
    const matches = matchRoutes(appRouterRoutes, location);
    const matchedRoute = matches?.[matches.length - 1];
    const routeTitle = (matchedRoute?.route.handle as RouteHandle | undefined)?.title;

    document.title = routeTitle ? `${routeTitle} - ${appEnv.title}` : appEnv.title;
  }, [location]);

  return null;
}
