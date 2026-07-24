import { describe, expect, it } from "vitest";

import { readUserListParams } from "./params";

describe("用户列表 URL 参数", () => {
  it("空参数使用分页默认值", () => {
    expect(readUserListParams(new URLSearchParams())).toEqual({
      page: 1,
      pageSize: 10,
      name: undefined,
      sortField: undefined,
      sortOrder: undefined,
      status: undefined,
      username: undefined,
    });
  });

  it("读取搜索、分页和排序参数", () => {
    const params = new URLSearchParams({
      page: "2",
      pageSize: "20",
      sortField: "createdAt",
      sortOrder: "descend",
      status: "enabled",
      username: "viewer",
    });

    expect(readUserListParams(params)).toMatchObject({
      page: 2,
      pageSize: 20,
      sortField: "createdAt",
      sortOrder: "descend",
      status: "enabled",
      username: "viewer",
    });
  });
});
