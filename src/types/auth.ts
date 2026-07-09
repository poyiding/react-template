export type UserRole = "admin" | "user";

export type CurrentUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type LoginFormValues = {
  username: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: CurrentUser;
};
