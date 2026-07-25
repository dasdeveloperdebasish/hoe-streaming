import { useQuery } from "@tanstack/react-query";
import { searchContent } from "@/services/api";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchContent(query),
    enabled: query.trim().length > 0, // don't fetch on empty input
  });
}
