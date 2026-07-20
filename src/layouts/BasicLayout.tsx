import { QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Button, Tooltip } from "antd";
import { createStyles } from "antd-style";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppFooter } from "@/components/AppFooter";
import { AppLogo } from "@/components/AppLogo";
import { UserAvatarDropdown } from "@/components/UserAvatarDropdown";
import { proLayoutAppearance } from "@/layouts/layout.config";
import { createAuthorizedLayoutRoute } from "@/router/routes";
import { useAuthStore } from "@/stores/auth.store";
import { appEnv } from "@/utils/env";
import { clearSession } from "@/utils/session";

const useStyles = createStyles(({ css }) => ({
  shell: css`
    min-height: 100vh;
  `,
}));

export function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { styles } = useStyles();
  const route = createAuthorizedLayoutRoute(user?.permissions);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <ProLayout
      {...proLayoutAppearance}
      className={styles.shell}
      collapsed={collapsed}
      footerRender={() => <AppFooter />}
      location={{ pathname: location.pathname }}
      logo={<AppLogo />}
      menu={{ locale: false }}
      route={route}
      title={appEnv.title}
      actionsRender={() => [
        <Tooltip key="pro-docs" title="Ant Design Pro 文档">
          <Button
            aria-label="打开 Ant Design Pro 文档"
            href="https://pro.ant.design"
            icon={<QuestionCircleOutlined />}
            target="_blank"
            type="text"
          />
        </Tooltip>,
      ]}
      avatarProps={{
        icon: <UserOutlined />,
        title: user?.name || "Admin",
        render: (_, avatarChildren) => (
          <UserAvatarDropdown onLogout={handleLogout}>{avatarChildren}</UserAvatarDropdown>
        ),
      }}
      menuItemRender={(item, dom) => {
        if (!item.path) {
          return dom;
        }

        return <Link to={item.path}>{dom}</Link>;
      }}
      onCollapse={setCollapsed}
    >
      <Outlet />
    </ProLayout>
  );
}
