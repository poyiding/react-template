import { Typography } from "antd";

type AppLogoProps = {
  collapsed?: boolean;
};

export function AppLogo({ collapsed = false }: AppLogoProps) {
  return (
    <div className="app-logo">
      <div className="app-logo-mark">R</div>
      {!collapsed && (
        <Typography.Text strong className="app-logo-text">
          React Template
        </Typography.Text>
      )}
    </div>
  );
}
