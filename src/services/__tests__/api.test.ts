import { fetchContentById, fetchContentByIds } from "@/services/api";
import { CONTENT } from "@/data/content";

describe("api service", () => {
  it("returns a content item by id", async () => {
    const id = Object.keys(CONTENT)[0]!;
    const result = await fetchContentById(id);
    expect(result.id).toBe(id);
    expect(result.title).toBeDefined();
  });

  it("throws for an unknown id", async () => {
    await expect(fetchContentById("does-not-exist")).rejects.toThrow();
  });

  it("resolves multiple ids and skips unknown ones", async () => {
    const ids = Object.keys(CONTENT).slice(0, 3);
    const result = await fetchContentByIds([...ids, "bad-id"]);
    expect(result).toHaveLength(3);
  });
});
