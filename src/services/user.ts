import { mockCreateUser, mockDeleteUser, mockGetUsers, mockUpdateUser } from "@/mocks/users";
import type { PaginationResult } from "@/types/common";
import type { CreateUserInput, UpdateUserInput, User, UserListParams } from "@/types/user";

/**
 * 用户领域的统一请求入口。
 * 当前委托给内存 Mock；接入后端时在此替换为 request() 调用，页面和 Query Hooks 无需调整。
 */
export function getUsers(params: UserListParams): Promise<PaginationResult<User>> {
  return mockGetUsers(params);
}

export function createUser(input: CreateUserInput): Promise<User> {
  return mockCreateUser(input);
}

export function updateUser(input: UpdateUserInput): Promise<User> {
  return mockUpdateUser(input);
}

export function deleteUser(id: string): Promise<void> {
  return mockDeleteUser(id);
}
