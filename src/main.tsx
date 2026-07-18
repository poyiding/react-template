import React from "react";
import ReactDOM from "react-dom/client";

import "antd/dist/reset.css";
import "@/styles/global.css";

import { appEnv } from "@/utils/env";

import App from "./App";

async function bootstrap() {
  if (import.meta.env.DEV && appEnv.enableMock) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void bootstrap();
