import { queryClient } from "@/app/query-client";
import { useAuthStore } from "@/stores/auth.store";

/**
 * 清理本地会话与 Query 缓存。
 * 模板将 Token 存在 localStorage 仅供演示；真实项目应按后端协议决定存储与清理方式。
 */
export function clearSession() {
  useAuthStore.getState().logout();
  queryClient.clear();
}
