import { useInfiniteQuery } from "@tanstack/react-query";
import { searchContent } from "@/services/api";

export function useSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => searchContent(query, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: query.trim().length > 0,
  });
}
