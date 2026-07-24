import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUser, getUsers } from "@/services/user";
import { createTestQueryClient } from "@/test/render";

import { useCreateUserMutation, useUsersQuery } from "./useUserQueries";

vi.mock("@/services/user", () => ({
  createUser: vi.fn(),
  deleteUser: vi.fn(),
  getUsers: vi.fn(),
  updateUser: vi.fn(),
}));

const mockedGetUsers = vi.mocked(getUsers);
const mockedCreateUser = vi.mocked(createUser);

describe("用户 Query Hooks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("将查询参数纳入 Query Key", async () => {
    mockedGetUsers.mockResolvedValue({ list: [], total: 0 });
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const params = { page: 2, pageSize: 20, username: "viewer" };

    const { result } = renderHook(() => useUsersQuery(params), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetUsers).toHaveBeenCalledWith(params);
    expect(queryClient.getQueryData(["usersList", params])).toEqual({ list: [], total: 0 });
  });

  it("新增成功后失效全部用户列表缓存", async () => {
    mockedCreateUser.mockResolvedValue({
      createdAt: "2026-07-24T00:00:00.000Z",
      email: "new@example.com",
      id: "new-user",
      name: "新用户",
      role: "普通用户",
      status: "enabled",
      username: "new-user",
    });
    const queryClient = createTestQueryClient();
    const queryKey = ["usersList", { page: 1, pageSize: 10 }];
    queryClient.setQueryData(queryKey, { list: [], total: 0 });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    await result.current.mutateAsync({
      email: "new@example.com",
      name: "新用户",
      role: "普通用户",
      status: "enabled",
      username: "new-user",
    });

    await waitFor(() => expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(true));
  });
});
