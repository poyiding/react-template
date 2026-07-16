import { QueryClient } from "@tanstack/react-query";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      gcTime: 5 * MINUTE,
      refetchOnWindowFocus: true,
      retry: false,
      staleTime: 30 * SECOND,
    },
  },
});
