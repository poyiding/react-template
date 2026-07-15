import type { PaginationParams } from "@/types/common";

export type UserStatus = "disabled" | "enabled";

export type User = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: string;
  status: UserStatus;
  username: string;
};

export type UserListParams = PaginationParams & {
  keyword?: string;
};

export type CreateUserInput = Pick<User, "email" | "name" | "role" | "status" | "username">;

export type UpdateUserInput = Partial<CreateUserInput> & {
  id: string;
};
