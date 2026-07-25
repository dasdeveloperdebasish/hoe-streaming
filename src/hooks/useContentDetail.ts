import { useQuery } from "@tanstack/react-query";
import { fetchContentById, fetchContentByIds } from "@/services/api";

export function useContentDetail(id: string) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => fetchContentById(id),
  });
}

export function useRelatedContent(ids: string[]) {
  return useQuery({
    queryKey: ["related", ids],
    queryFn: () => fetchContentByIds(ids),
    enabled: ids.length > 0, // don't fire the query if there are no related ids
  });
}
