import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown, type MenuProps } from "antd";
import type { ReactNode } from "react";

type UserAvatarDropdownProps = {
  children: ReactNode;
  onLogout: () => void;
};

const menuItems: MenuProps["items"] = [
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "退出登录",
  },
];

export function UserAvatarDropdown({ children, onLogout }: UserAvatarDropdownProps) {
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      onLogout();
    }
  };

  return (
    <Dropdown arrow menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight">
      {children}
    </Dropdown>
  );
}
