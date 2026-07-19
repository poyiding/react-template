import { delay, http, HttpResponse } from "msw";

import type { LoginFormValues, LoginResult, Permission } from "@/types/auth";
import { ALL_PERMISSIONS } from "@/types/auth";
import type { ApiResponse } from "@/types/common";
import { appEnv } from "@/utils/env";

const loginUrl = `${appEnv.apiBaseUrl.replace(/\/$/, "")}/auth/login`;

const viewerPermissions: Permission[] = ["dashboard:view", "system:user:view"];

function resolveLoginResult(username: string): LoginResult {
  const normalized = username.trim().toLowerCase();

  if (normalized === "viewer") {
    return {
      token: "mock-token-viewer",
      user: {
        id: "2",
        name: username,
        permissions: viewerPermissions,
        role: "user",
      },
    };
  }

  return {
    token: "mock-token-admin",
    user: {
      id: "1",
      name: username || "admin",
      permissions: [...ALL_PERMISSIONS],
      role: "admin",
    },
  };
}

export const authHandlers = [
  http.post(loginUrl, async ({ request }) => {
    const values = (await request.json()) as LoginFormValues;

    await delay(400);

    return HttpResponse.json<ApiResponse<LoginResult>>({
      data: resolveLoginResult(values.username),
    });
  }),
];
