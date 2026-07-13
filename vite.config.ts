import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";

const requiredEnvNames = ["VITE_APP_TITLE", "VITE_APP_ENV", "VITE_API_BASE_URL"] as const;
const routeChunkBudgetKb = 600;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const missingEnvNames = requiredEnvNames.filter((name) => !env[name]?.trim());
  const chunkStrategy = process.env.BUILD_CHUNK_STRATEGY ?? "route";

  if (missingEnvNames.length > 0) {
    throw new Error(
      `缺少必要环境变量：${missingEnvNames.join(", ")}。请参考 .env.development 配置。`,
    );
  }

  if (!["route", "single"].includes(chunkStrategy)) {
    throw new Error(`无效的 BUILD_CHUNK_STRATEGY：${chunkStrategy}，仅支持 route 或 single。`);
  }

  return {
    plugins: [
      react(),
      process.env.ANALYZE === "true" &&
        visualizer({
          filename: "dist/bundle-report.html",
          gzipSize: true,
          brotliSize: true,
          open: false,
          template: "treemap",
        }),
    ],
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
    build: {
      chunkSizeWarningLimit: chunkStrategy === "single" ? 1500 : routeChunkBudgetKb,
      rolldownOptions: {
        output: {
          codeSplitting: chunkStrategy === "route",
        },
      },
    },
  };
});
