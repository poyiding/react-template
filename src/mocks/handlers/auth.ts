import { delay, http, HttpResponse } from "msw";

import type { LoginFormValues, LoginResult } from "@/types/auth";
import type { ApiResponse } from "@/types/common";
import { appEnv } from "@/utils/env";

const loginUrl = `${appEnv.apiBaseUrl.replace(/\/$/, "")}/auth/login`;

export const authHandlers = [
  http.post(loginUrl, async ({ request }) => {
    const values = (await request.json()) as LoginFormValues;

    await delay(400);

    return HttpResponse.json<ApiResponse<LoginResult>>({
      data: {
        token: "mock-token",
        user: {
          id: "1",
          name: values.username,
          role: "admin",
        },
      },
    });
  }),
];
