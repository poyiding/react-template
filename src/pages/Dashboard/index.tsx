import { PageContainer } from "@ant-design/pro-components";
import { Card, Col, Row, Space, Statistic, Typography } from "antd";

const stats = [
  { label: "今日访问", value: 1280 },
  { label: "待处理任务", value: 18 },
  { label: "接口成功率", value: 99.8, suffix: "%" },
];

export function DashboardPage() {
  return (
    <PageContainer content="这里是项目核心层示例，后续可以按需接入权限、菜单、主题和业务模块。">
      <Space className="page-stack" orientation="vertical" size={16}>
        <Row gutter={[16, 16]}>
          {stats.map((item) => (
            <Col key={item.label} lg={8} md={12} sm={24} xs={24}>
              <Card>
                <Statistic title={item.label} value={item.value} suffix={item.suffix} />
              </Card>
            </Col>
          ))}
        </Row>

        <Card title="基础能力">
          <Typography.Paragraph>
            当前模板已包含路由、布局、登录状态、请求封装、Ant Design 主题入口和基础工程规范。
          </Typography.Paragraph>
        </Card>
      </Space>
    </PageContainer>
  );
}
