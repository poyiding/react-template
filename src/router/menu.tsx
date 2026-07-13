import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuDataItem } from "@ant-design/pro-components";

export const appMenuItems: MenuDataItem[] = [
  {
    path: "/dashboard",
    icon: <DashboardOutlined />,
    name: "工作台",
  },
  {
    path: "/system",
    icon: <SettingOutlined />,
    name: "系统管理",
    children: [
      {
        path: "/system/users",
        icon: <UserOutlined />,
        name: "用户管理",
      },
      {
        path: "/system/roles",
        icon: <SafetyCertificateOutlined />,
        name: "角色管理",
      },
    ],
  },
];
