import type { ContentDetail, HomeFeed } from "@/types/content";
import { CONTENT } from "@/data/content";
import { HOME_FEED } from "@/data/feed";

// Simulate real network latency so loading states are visible and honest.
const LATENCY_MS = 900;

// Roughly 1 in 12 calls fail, so the error state is reachable in a real run.
const FAILURE_RATE = 0.08;

export type Page<T> = {
  items: T[];
  nextPage: number | null;
};

const PAGE_SIZE = 8;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail(): void {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Network request failed");
  }
}

export async function fetchHomeFeed(): Promise<HomeFeed> {
  await wait(LATENCY_MS);
  maybeFail();
  return HOME_FEED;
}

export async function fetchContentById(id: string): Promise<ContentDetail> {
  await wait(LATENCY_MS);
  maybeFail();

  const item = CONTENT[id];
  if (!item) {
    throw new Error(`Content not found: ${id}`);
  }
  return item;
}
export async function fetchContentByIds(
  ids: string[],
): Promise<ContentDetail[]> {
  await wait(LATENCY_MS);
  return ids
    .map((id) => CONTENT[id])
    .filter((item): item is ContentDetail => item !== undefined);
}

export async function searchContent(
  query: string,
  page: number,
): Promise<Page<ContentDetail>> {
  await wait(500);
  const q = query.trim().toLowerCase();
  if (q.length === 0) return { items: [], nextPage: null };

  const all = Object.values(CONTENT).filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.genres.some((g) => g.toLowerCase().includes(q)),
  );

  const start = page * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  const nextPage = start + PAGE_SIZE < all.length ? page + 1 : null;

  return { items, nextPage };
}
