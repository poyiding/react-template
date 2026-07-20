import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { App as AntdApp, Button, Card, Form, Input, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { login as loginService } from "@/services/auth";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginFormValues } from "@/types/auth";
import { getSafeRedirectPath } from "@/utils/redirect";

type LoginLocationState = {
  from?: {
    pathname?: string;
    search?: string;
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const { message } = AntdApp.useApp();
  const loginMutation = useMutation({ mutationFn: loginService });

  const from = (location.state as LoginLocationState | null)?.from;
  const redirectPath = getSafeRedirectPath(
    from?.pathname ? `${from.pathname}${from.search ?? ""}` : undefined,
  );

  const handleFinish = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync(values);
      login(result);
      message.success("登录成功");
      navigate(redirectPath, { replace: true });
    } catch {
      // HTTP 错误由响应拦截器统一提示。
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
            extra="演示账号：admin（全部权限）/ viewer（仅工作台与用户查看）"
          >
            <Input autoFocus placeholder="admin" prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="任意密码" prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Button
            block
            htmlType="submit"
            loading={loginMutation.isPending}
            size="large"
            type="primary"
          >
            登录
          </Button>
        </Form>
      </Card>
    </main>
  );
}
