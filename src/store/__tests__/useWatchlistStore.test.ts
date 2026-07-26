import { useWatchlistStore } from "@/store/useWatchlistStore";

describe("watchlist store", () => {
  beforeEach(() => {
    useWatchlistStore.setState({ ids: [] });
  });

  it("adds an id when toggled on", () => {
    useWatchlistStore.getState().toggle("c01");
    expect(useWatchlistStore.getState().ids).toContain("c01");
  });

  it("removes an id when toggled again", () => {
    useWatchlistStore.getState().toggle("c01");
    useWatchlistStore.getState().toggle("c01");
    expect(useWatchlistStore.getState().ids).not.toContain("c01");
  });

  it("reports membership with has()", () => {
    useWatchlistStore.getState().toggle("c05");
    expect(useWatchlistStore.getState().has("c05")).toBe(true);
    expect(useWatchlistStore.getState().has("c99")).toBe(false);
  });
});
