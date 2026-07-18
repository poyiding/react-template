import { delay, http, HttpResponse } from "msw";

import { initialUsers } from "@/mocks/data/users";
import type { ApiResponse, PaginationResult } from "@/types/common";
import type { CreateUserInput, UpdateUserInput, User } from "@/types/user";
import { appEnv } from "@/utils/env";

const MOCK_DELAY = 350;
const apiBaseUrl = appEnv.apiBaseUrl.replace(/\/$/, "");
const listUserUrl = `${apiBaseUrl}/list/user`;
const addUserUrl = `${apiBaseUrl}/add/user`;
const updateUserUrl = `${apiBaseUrl}/update/user/:id`;
const deleteUserUrl = `${apiBaseUrl}/delete/user/:id`;

let users = [...initialUsers];

function hasUsername(username: string, excludedId?: string) {
  return users.some((user) => user.username === username && user.id !== excludedId);
}

export const userHandlers = [
  http.get(listUserUrl, async ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword")?.trim().toLocaleLowerCase();
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const filteredUsers = keyword
      ? users.filter((user) =>
          [user.email, user.name, user.username].some((value) =>
            value.toLocaleLowerCase().includes(keyword),
          ),
        )
      : users;
    const start = (page - 1) * pageSize;

    await delay(MOCK_DELAY);

    return HttpResponse.json<ApiResponse<PaginationResult<User>>>({
      data: {
        list: filteredUsers.slice(start, start + pageSize),
        total: filteredUsers.length,
      },
    });
  }),
  http.post(addUserUrl, async ({ request }) => {
    const input = (await request.json()) as CreateUserInput;

    await delay(MOCK_DELAY);

    if (hasUsername(input.username)) {
      return HttpResponse.json({ message: "用户名已存在" }, { status: 409 });
    }

    const user: User = {
      ...input,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

    users = [user, ...users];

    return HttpResponse.json<ApiResponse<User>>({ data: user }, { status: 201 });
  }),
  http.put(updateUserUrl, async ({ params, request }) => {
    const id = String(params.id);
    const input = (await request.json()) as Omit<UpdateUserInput, "id">;
    const currentUser = users.find((user) => user.id === id);

    await delay(MOCK_DELAY);

    if (!currentUser) {
      return HttpResponse.json({ message: "用户不存在" }, { status: 404 });
    }

    if (input.username && hasUsername(input.username, id)) {
      return HttpResponse.json({ message: "用户名已存在" }, { status: 409 });
    }

    const updatedUser = { ...currentUser, ...input };
    users = users.map((user) => (user.id === id ? updatedUser : user));

    return HttpResponse.json<ApiResponse<User>>({ data: updatedUser });
  }),
  http.delete(deleteUserUrl, async ({ params }) => {
    const id = String(params.id);

    await delay(MOCK_DELAY);

    if (!users.some((user) => user.id === id)) {
      return HttpResponse.json({ message: "用户不存在" }, { status: 404 });
    }

    users = users.filter((user) => user.id !== id);

    return new HttpResponse(null, { status: 204 });
  }),
];
