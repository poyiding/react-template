import { Button, Result, Space } from "antd";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type ExceptionStatus = "403" | "404" | "500";

type ExceptionPageProps = {
  status: ExceptionStatus;
  title?: string;
  subTitle: string;
  extra?: ReactNode;
};

export function ExceptionPage({ status, title = status, subTitle, extra }: ExceptionPageProps) {
  const navigate = useNavigate();

  return (
    <Result
      extra={
        extra ?? (
          <Space>
            <Button onClick={() => navigate(-1)}>返回上一页</Button>
            <Button type="primary" onClick={() => navigate("/", { replace: true })}>
              返回首页
            </Button>
          </Space>
        )
      }
      status={status}
      subTitle={subTitle}
      title={title}
    />
  );
}

export function ForbiddenPage() {
  return <ExceptionPage status="403" subTitle="你没有权限访问该页面" />;
}

export function ServerErrorPage() {
  return <ExceptionPage status="500" subTitle="页面发生异常，请稍后重试" />;
}
