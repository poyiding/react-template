import { PageContainer } from "@ant-design/pro-components";
import { Card, Typography } from "antd";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function RoleManagementPage() {
  useDocumentTitle("角色管理 - React Template");

  return (
    <PageContainer content="在这里维护系统角色及其权限配置。" title="角色管理">
      <Card>
        <Typography.Text type="secondary">角色列表和权限配置将在后续业务阶段完善。</Typography.Text>
      </Card>
    </PageContainer>
  );
}
