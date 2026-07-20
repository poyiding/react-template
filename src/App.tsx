import { App as AntdApp, ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";

import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppRouter } from "@/router";

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 6,
          colorPrimary: "#1677ff",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
      }}
    >
      <AntdApp>
        <QueryProvider>
          <AppRouter />
        </QueryProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
