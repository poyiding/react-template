import { PageContainer } from "@ant-design/pro-components";
import { Card, Typography } from "antd";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function UserManagementPage() {
  useDocumentTitle("用户管理 - React Template");

  return (
    <PageContainer title={false}>
      <Card>
        <Typography.Text type="secondary">用户列表和管理操作将在后续业务阶段完善。</Typography.Text>
      </Card>
    </PageContainer>
  );
}
