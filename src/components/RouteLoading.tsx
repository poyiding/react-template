import { Spin } from "antd";

export function RouteLoading() {
  return (
    <div aria-label="页面加载中" className="route-loading" role="status">
      <Spin size="large" />
    </div>
  );
}
