import { DashboardOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

export const appMenuItems: MenuProps["items"] = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "工作台",
  },
];
