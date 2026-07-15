import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createUser, deleteUser, getUsers, updateUser } from "@/services/user";
import type { UserListParams } from "@/types/user";

const USER_LIST_QUERY_KEY = ["usersList"] as const;

export function useUsersQuery(params: UserListParams) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getUsers(params),
    queryKey: [...USER_LIST_QUERY_KEY, params],
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY,
      }),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY,
      }),
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: USER_LIST_QUERY_KEY,
      }),
  });
}
