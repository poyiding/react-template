import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppLogo } from "@/components/AppLogo";
import { appMenuItems } from "@/router/menu";
import { useAuthStore } from "@/stores/auth.store";

const { Header, Sider, Content } = Layout;

export function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const selectedKeys = useMemo(() => {
    const matched = appMenuItems?.find((item) => {
      if (!item || !("key" in item)) {
        return false;
      }

      return location.pathname.startsWith(String(item.key));
    });

    return matched && "key" in matched ? [String(matched.key)] : [];
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Layout className="app-shell">
      <Sider
        breakpoint="lg"
        collapsed={collapsed}
        collapsible
        theme="light"
        trigger={null}
        width={232}
      >
        <AppLogo collapsed={collapsed} />
        <Menu
          items={appMenuItems}
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <Button
            aria-label={collapsed ? "展开菜单" : "收起菜单"}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            type="text"
            onClick={() => setCollapsed((value) => !value)}
          />

          <Space size={16}>
            <Space>
              <Avatar size="small">{user?.name?.slice(0, 1).toUpperCase()}</Avatar>
              <Typography.Text>{user?.name || "Admin"}</Typography.Text>
            </Space>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              退出
            </Button>
          </Space>
        </Header>

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
