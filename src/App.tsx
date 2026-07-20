import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

import { QueryProvider } from "@/app/providers/QueryProvider";
import { appTheme } from "@/app/theme";
import { AppRouter } from "@/router";

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={appTheme}>
      <AntdApp>
        <QueryProvider>
          <AppRouter />
        </QueryProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
