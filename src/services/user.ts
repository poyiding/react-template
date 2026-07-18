import { createResponseError } from "@/api/error";
import { http } from "@/api/http";
import type { ApiResponse, PaginationResult } from "@/types/common";
import type { CreateUserInput, UpdateUserInput, User, UserListParams } from "@/types/user";

type UpdateUserRequest = Omit<UpdateUserInput, "id">;

export async function getUsers(params: UserListParams): Promise<PaginationResult<User>> {
  try {
    const response = await http.get<ApiResponse<PaginationResult<User>>>("/list/user", {
      params,
    });

    return response.data.data;
  } catch (error) {
    throw createResponseError(error, "加载用户列表失败");
  }
}

export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    const response = await http.post<ApiResponse<User>>("/add/user", input);

    return response.data.data;
  } catch (error) {
    throw createResponseError(error, "创建用户失败");
  }
}

export async function updateUser({ id, ...input }: UpdateUserInput): Promise<User> {
  try {
    const request: UpdateUserRequest = input;
    const response = await http.put<ApiResponse<User>>(`/update/user/${id}`, request);

    return response.data.data;
  } catch (error) {
    throw createResponseError(error, "更新用户失败");
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await http.delete<void>(`/delete/user/${id}`);
  } catch (error) {
    throw createResponseError(error, "删除用户失败");
  }
}
