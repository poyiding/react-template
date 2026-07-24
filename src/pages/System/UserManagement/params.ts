import type { UserListParams, UserStatus } from "@/types/user";

const defaultParams: UserListParams = { page: 1, pageSize: 10 };

export function readUserListParams(searchParams: URLSearchParams): UserListParams {
  const page = Number(searchParams.get("page")) || defaultParams.page;
  const pageSize = Number(searchParams.get("pageSize")) || defaultParams.pageSize;
  const name = searchParams.get("name") || undefined;
  const username = searchParams.get("username") || undefined;
  const status = searchParams.get("status") as UserStatus | null;
  const sortField = searchParams.get("sortField") as UserListParams["sortField"];
  const sortOrder = searchParams.get("sortOrder") as UserListParams["sortOrder"];

  return {
    page,
    pageSize,
    name,
    sortField: sortField || undefined,
    sortOrder: sortOrder || undefined,
    status: status || undefined,
    username,
  };
}
