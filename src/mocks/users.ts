import type { PaginationResult } from "@/types/common";
import type { CreateUserInput, UpdateUserInput, User, UserListParams } from "@/types/user";

const MOCK_DELAY = 350;

let users: User[] = [
  {
    createdAt: "2026-07-01T09:00:00.000Z",
    email: "admin@example.com",
    id: "1",
    name: "系统管理员",
    role: "管理员",
    status: "enabled",
    username: "admin",
  },
  {
    createdAt: "2026-07-02T10:30:00.000Z",
    email: "zhangsan@example.com",
    id: "2",
    name: "张三",
    role: "运营",
    status: "enabled",
    username: "zhangsan",
  },
  {
    createdAt: "2026-07-03T13:20:00.000Z",
    email: "lisi@example.com",
    id: "3",
    name: "李四",
    role: "审计员",
    status: "disabled",
    username: "lisi",
  },
];

function ensureUniqueUsername(username: string, excludedId?: string) {
  if (users.some((user) => user.username === username && user.id !== excludedId)) {
    throw new Error("用户名已存在");
  }
}

export async function mockGetUsers(params: UserListParams): Promise<PaginationResult<User>> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY));

  const keyword = params.keyword?.trim().toLocaleLowerCase();
  const filteredUsers = keyword
    ? users.filter((user) =>
        [user.email, user.name, user.username].some((value) =>
          value.toLocaleLowerCase().includes(keyword),
        ),
      )
    : users;
  const start = (params.page - 1) * params.pageSize;

  return {
    list: filteredUsers.slice(start, start + params.pageSize),
    total: filteredUsers.length,
  };
}

export async function mockCreateUser(input: CreateUserInput): Promise<User> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY));
  ensureUniqueUsername(input.username);

  const user: User = {
    ...input,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
  };

  users = [user, ...users];
  return user;
}

export async function mockUpdateUser(input: UpdateUserInput): Promise<User> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY));

  const currentUser = users.find((user) => user.id === input.id);

  if (!currentUser) {
    throw new Error("用户不存在");
  }

  if (input.username) {
    ensureUniqueUsername(input.username, input.id);
  }

  const updatedUser = { ...currentUser, ...input };
  users = users.map((user) => (user.id === input.id ? updatedUser : user));
  return updatedUser;
}

export async function mockDeleteUser(id: string): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY));

  if (!users.some((user) => user.id === id)) {
    throw new Error("用户不存在");
  }

  users = users.filter((user) => user.id !== id);
}
