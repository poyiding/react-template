import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const requiredEnvNames = ["VITE_APP_TITLE", "VITE_APP_ENV", "VITE_API_BASE_URL"] as const;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const missingEnvNames = requiredEnvNames.filter((name) => !env[name]?.trim());

  if (missingEnvNames.length > 0) {
    throw new Error(
      `缺少必要环境变量：${missingEnvNames.join(", ")}。请参考 .env.development 配置。`,
    );
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
