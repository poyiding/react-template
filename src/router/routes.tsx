import {
  DashboardOutlined,
  FormOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ProLayoutProps } from "@ant-design/pro-components";
import { createElement, lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { RouteLoading } from "@/components/RouteLoading";
import { AccessRoute } from "@/router/AccessRoute";
import { filterMenuByAccess, type MenuItemWithAccess } from "@/router/access";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import type { Permission } from "@/types/auth";

type AppRouteLayout = "basic" | false;
type LazyComponentLoader = () => Promise<{ default: ComponentType }>;

type AppRoute = {
  /** 页面所需权限；未声明时仅需登录。 */
  access?: Permission | Permission[];
  children?: AppRoute[];
  component?: LazyComponentLoader;
  hideInMenu?: boolean;
  icon?: ReactNode;
  index?: boolean;
  layout?: AppRouteLayout;
  name?: string;
  path?: string;
  protected?: boolean;
  redirect?: string;
};

export type RouteHandle = {
  title?: string;
};

/**
 * 集中维护所有路由页面的懒加载入口。
 * 新增页面时先在此处注册，再在 appRoutes 中引用。
 */
const routeComponents = {
  basicLayout: () =>
    import("@/layouts/BasicLayout").then((module) => ({
      default: module.BasicLayout,
    })),
  dashboard: () =>
    import("@/pages/Dashboard").then((module) => ({
      default: module.DashboardPage,
    })),
  standardForm: () =>
    import("@/pages/Examples/StandardForm").then((module) => ({
      default: module.StandardFormPage,
    })),
  users: () =>
    import("@/pages/System/UserManagement").then((module) => ({
      default: module.UserManagementPage,
    })),
  roles: () =>
    import("@/pages/System/RoleManagement").then((module) => ({
      default: module.RoleManagementPage,
    })),
  login: () => import("@/pages/Login").then((module) => ({ default: module.LoginPage })),
  forbidden: () =>
    import("@/pages/Exception").then((module) => ({
      default: module.ForbiddenPage,
    })),
  serverError: () =>
    import("@/pages/Exception").then((module) => ({
      default: module.ServerErrorPage,
    })),
  notFound: () =>
    import("@/pages/NotFound").then((module) => ({
      default: module.NotFoundPage,
    })),
} satisfies Record<string, LazyComponentLoader>;

export const appRoutes: AppRoute[] = [
  {
    component: routeComponents.login,
    hideInMenu: true,
    layout: false,
    name: "登录",
    path: "/login",
  },
  {
    children: [
      {
        index: true,
        redirect: "dashboard",
      },
      {
        access: "dashboard:view",
        component: routeComponents.dashboard,
        icon: <DashboardOutlined />,
        name: "工作台",
        path: "dashboard",
      },
      {
        component: routeComponents.standardForm,
        icon: <FormOutlined />,
        name: "标准表单",
        path: "examples/form",
      },
      {
        children: [
          {
            index: true,
            redirect: "users",
          },
          {
            access: "system:user:view",
            component: routeComponents.users,
            icon: <UserOutlined />,
            name: "用户管理",
            path: "users",
          },
          {
            access: "system:role:view",
            component: routeComponents.roles,
            icon: <SafetyCertificateOutlined />,
            name: "角色管理",
            path: "roles",
          },
        ],
        icon: <SettingOutlined />,
        name: "系统管理",
        path: "system",
      },
      {
        component: routeComponents.forbidden,
        hideInMenu: true,
        name: "无权访问",
        path: "403",
      },
      {
        component: routeComponents.serverError,
        hideInMenu: true,
        name: "服务器错误",
        path: "500",
      },
    ],
    component: routeComponents.basicLayout,
    layout: "basic",
    path: "/",
    protected: true,
  },
  {
    component: routeComponents.notFound,
    hideInMenu: true,
    layout: false,
    name: "页面不存在",
    path: "*",
  },
];

/**
 * 将页面加载器转换为带统一加载状态的懒加载路由元素。
 */
function routeElement(loadComponent: LazyComponentLoader) {
  return <Suspense fallback={<RouteLoading />}>{createElement(lazy(loadComponent))}</Suspense>;
}

/**
 * 递归地将应用路由元数据转换为 React Router 可识别的路由对象。
 * 转换过程中会处理默认跳转、路由守卫、嵌套路由和页面标题元数据。
 */
function createRouterRoutes(routes: AppRoute[]): RouteObject[] {
  return routes.map((route) => {
    let element = route.component ? routeElement(route.component) : undefined;

    if (route.redirect) {
      element = <Navigate replace to={route.redirect} />;
    }

    // 先鉴权码，再包登录守卫，最终形态为 ProtectedRoute > AccessRoute > Page。
    if (route.access && element) {
      element = <AccessRoute access={route.access}>{element}</AccessRoute>;
    }

    if (route.protected && element) {
      element = <ProtectedRoute>{element}</ProtectedRoute>;
    }

    return {
      children: route.children ? createRouterRoutes(route.children) : undefined,
      element,
      handle: { title: route.name } satisfies RouteHandle,
      index: route.index || undefined,
      path: route.path,
    } as RouteObject;
  });
}

/**
 * 根据父级路径补全相对路径，绝对路径则保持不变。
 */
function resolvePath(parentPath: string, path: string) {
  if (path.startsWith("/")) {
    return path;
  }

  return `${parentPath.replace(/\/$/, "")}/${path}`;
}

/**
 * 递归地将应用路由元数据转换为 ProLayout 菜单和面包屑数据。
 * 默认跳转及缺少名称或路径的节点不会生成菜单项。
 */
function createMenuRoutes(routes: AppRoute[], parentPath: string): MenuItemWithAccess[] {
  return routes.flatMap((route) => {
    if (route.index || route.redirect || !route.path || !route.name) {
      return [];
    }

    const path = resolvePath(parentPath, route.path);

    return [
      {
        access: route.access,
        children: route.children ? createMenuRoutes(route.children, path) : undefined,
        hideInMenu: route.hideInMenu,
        icon: route.icon,
        name: route.name,
        path,
      },
    ];
  });
}

const basicLayoutRoute = appRoutes.find((route) => route.layout === "basic");

const allMenuRoutes = basicLayoutRoute?.children
  ? createMenuRoutes(basicLayoutRoute.children, basicLayoutRoute.path ?? "/")
  : [];

export const proLayoutRoute: ProLayoutProps["route"] = {
  path: basicLayoutRoute?.path ?? "/",
  routes: allMenuRoutes,
};

/** 按当前用户权限生成侧栏菜单，与路由 access 使用同一套规则。 */
export function createAuthorizedLayoutRoute(
  permissions: readonly Permission[] | undefined,
): ProLayoutProps["route"] {
  return {
    path: basicLayoutRoute?.path ?? "/",
    routes: filterMenuByAccess(allMenuRoutes, permissions),
  };
}

export const appRouterRoutes = createRouterRoutes(appRoutes);
