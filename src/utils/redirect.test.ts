import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "@/utils/redirect";

describe("登录回跳地址", () => {
  it("只允许站内且非登录页地址", () => {
    expect(getSafeRedirectPath("/system/users?page=2")).toBe("/system/users?page=2");
    expect(getSafeRedirectPath("https://example.com")).toBe("/dashboard");
    expect(getSafeRedirectPath("//example.com")).toBe("/dashboard");
    expect(getSafeRedirectPath("/login?next=/system/users")).toBe("/dashboard");
  });
});
