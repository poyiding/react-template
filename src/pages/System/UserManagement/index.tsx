import { Card, Typography } from "antd";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UserManagementPage() {
  useDocumentTitle("用户管理 - React Template");

  return (
    <Card>
      <Typography.Title level={3}>用户管理</Typography.Title>
      <Typography.Text type="secondary">在这里维护系统用户及其账号信息。</Typography.Text>
    </Card>
  );
}
