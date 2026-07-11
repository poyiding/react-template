import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export const appMenuItems: MenuProps["items"] = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "工作台",
  },
  {
    key: "/system",
    icon: <SettingOutlined />,
    label: "系统管理",
    children: [
      {
        key: "/system/users",
        icon: <UserOutlined />,
        label: "用户管理",
      },
      {
        key: "/system/roles",
        icon: <SafetyCertificateOutlined />,
        label: "角色管理",
      },
    ],
  },
];
