/**
 * 校验登录后的站内回跳地址，避免开放重定向。
 */
export function getSafeRedirectPath(path: unknown, fallback = "/dashboard"): string {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  if (path === "/login" || path.startsWith("/login?")) {
    return fallback;
  }

  return path;
}
