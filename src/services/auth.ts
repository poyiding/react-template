import { mockLogin } from "@/mocks/auth";
import type { LoginFormValues, LoginResult } from "@/types/auth";

/**
 * 认证领域的统一请求入口。
 * 当前委托给内存 Mock；接入后端时在此替换为 request() 调用。
 */
export function login(values: LoginFormValues): Promise<LoginResult> {
  return mockLogin(values);
}
