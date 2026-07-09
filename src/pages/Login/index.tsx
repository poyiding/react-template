import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { App as AntdApp, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { loginApi } from "@/api/auth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginFormValues } from "@/types/auth";

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  useDocumentTitle("登录 - React Template");

  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);

  const redirectPath =
    (location.state as LoginLocationState | null)?.from?.pathname || "/dashboard";

  const handleFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const result = await loginApi(values);
      login(result);
      message.success("登录成功");
      navigate(redirectPath, { replace: true });
    } catch {
      message.error("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Card className="login-panel">
        <div className="login-heading">
          <Typography.Title level={2}>React Template</Typography.Title>
          <Typography.Text type="secondary">请输入账号信息进入系统</Typography.Text>
        </div>

        <Form<LoginFormValues>
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              autoFocus
              placeholder="admin"
              prefix={<UserOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              placeholder="任意密码"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <Button block htmlType="submit" loading={loading} size="large" type="primary">
            登录
          </Button>
        </Form>
      </Card>
    </main>
  );
}
