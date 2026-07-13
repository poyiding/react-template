import { Button, Result, Space } from "antd";
import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

const chunkErrorPatterns = [
  /ChunkLoadError/i,
  /Loading chunk \S+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
];

function isChunkLoadError(error: Error) {
  return chunkErrorPatterns.some((pattern) => pattern.test(`${error.name}: ${error.message}`));
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("页面渲染异常", error, errorInfo);
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    const chunkLoadFailed = isChunkLoadError(error);

    return (
      <Result
        extra={
          <Space>
            <Button onClick={() => window.location.assign("/")}>返回首页</Button>
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </Space>
        }
        status="500"
        subTitle={
          chunkLoadFailed
            ? "新版资源加载失败，可能是应用刚刚更新，请刷新页面重试"
            : "页面发生异常，请刷新后重试"
        }
        title={chunkLoadFailed ? "资源加载失败" : "页面发生异常"}
      />
    );
  }
}
