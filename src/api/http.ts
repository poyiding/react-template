import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { message } from "antd";

import { getResponseErrorMessage } from "@/api/error";
import { useAuthStore } from "@/stores/auth.store";
import { clearSession } from "@/utils/session";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!axios.isCancel(error)) {
      void message.error(getResponseErrorMessage(error, "请求失败，请稍后重试"));
    }

    // 真实后端返回密码错误时页面会立即刷新并丢失错误反馈。
    // 应排除登录接口或区分会话失效与凭证错误。
    const isLoginRequest = error.config?.url?.split("?")[0] === "/auth/login";

    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession();
      window.location.assign("/login");
    }

    return Promise.reject(error);
  },
);
