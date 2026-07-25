import { useQuery } from "@tanstack/react-query";
import { fetchHomeFeed } from "@/services/api";

export function useHomeFeed() {
  return useQuery({
    queryKey: ["homeFeed"],
    queryFn: fetchHomeFeed,
  });
}
