import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // one silent retry before showing the error state
      staleTime: 60_000, // data stays fresh 60s; no refetch on remount within that
      refetchOnWindowFocus: false, // pointless on mobile; avoids surprise refetches
    },
  },
});
