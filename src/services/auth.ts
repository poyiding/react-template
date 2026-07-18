import { createResponseError } from "@/api/error";
import { http } from "@/api/http";
import type { LoginFormValues, LoginResult } from "@/types/auth";
import type { ApiResponse } from "@/types/common";

export async function login(values: LoginFormValues): Promise<LoginResult> {
  try {
    const response = await http.post<ApiResponse<LoginResult>>("/auth/login", values);

    return response.data.data;
  } catch (error) {
    throw createResponseError(error, "登录失败，请稍后重试");
  }
}
