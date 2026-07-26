import type { Category, HomeFeed, Section } from "@/types/content";
import { CONTENT } from "./content";

const categories: Category[] = [
  { id: "all", label: "All" },
  { id: "action", label: "Action" },
  { id: "drama", label: "Drama" },
  { id: "comedy", label: "Comedy" },
  { id: "documentary", label: "Documentary" },
];

const ids = Object.keys(CONTENT);

const sections: Section[] = [
  { id: "continue", title: "Continue watching", itemIds: ids.slice(0, 6) },
  { id: "trending", title: "Trending now", itemIds: ids.slice(6, 16) },
  { id: "new", title: "New releases", itemIds: ids.slice(16, 26) },
  { id: "docs", title: "Documentaries", itemIds: ids.slice(4, 12) },
];

export const HOME_FEED: HomeFeed = {
  hero: CONTENT["c01"]!,
  categories,
  sections,
};
