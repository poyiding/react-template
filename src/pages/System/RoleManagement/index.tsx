import { Card, Typography } from "antd";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function RoleManagementPage() {
  useDocumentTitle("角色管理 - React Template");

  return (
    <Card>
      <Typography.Title level={3}>角色管理</Typography.Title>
      <Typography.Text type="secondary">在这里维护系统角色及其权限配置。</Typography.Text>
    </Card>
  );
}
