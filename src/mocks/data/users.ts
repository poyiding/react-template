import type { User } from "@/types/user";

export const initialUsers: User[] = [
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
