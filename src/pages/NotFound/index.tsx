import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          返回首页
        </Button>
      }
      status="404"
      subTitle="你访问的页面不存在"
      title="404"
    />
  );
}
