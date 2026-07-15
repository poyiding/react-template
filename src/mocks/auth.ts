import type { LoginFormValues, LoginResult } from "@/types/auth";

export async function mockLogin(values: LoginFormValues): Promise<LoginResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 400));

  return {
    token: "mock-token",
    user: {
      id: "1",
      name: values.username,
      role: "admin",
    },
  };
}
