import { writeFileSync } from "fs";

const genres = [
  ["Thriller", "Sci-Fi"],
  ["Drama"],
  ["Comedy"],
  ["Action", "Crime"],
  ["Documentary"],
  ["Romance", "Drama"],
  ["Horror"],
  ["Fantasy", "Adventure"],
];
const ratings = ["U/A 7+", "U/A 13+", "U/A 16+", "A"];
const durations = ["48m", "1h 52m", "2 seasons", "4 seasons", "6 episodes"];
const videos = [
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_5MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/1080/Sintel_1080_10s_5MB.mp4",
  "https://test-videos.co.uk/vids/tearsofsteel/mp4/h264/1080/Tears_of_Steel_1080_10s_5MB.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_10MB.mp4",
];
const titles = [
  "The Last Signal",
  "Paper Cities",
  "Quiet Hours",
  "Ironbound",
  "Deep Field",
  "After the Rain",
  "Hollow Season",
  "Northwind",
  "Glasshouse",
  "Tidepool",
  "Ember Road",
  "Salt & Static",
  "The Long Wait",
  "Understory",
  "Lantern",
  "Cold Harbor",
  "Margin",
  "Featherweight",
  "Drift",
  "Overgrown",
  "Signal Fire",
  "Lowtide",
  "Backlot",
  "Meridian",
  "Nightschool",
  "Foxglove",
  "The Undertow",
  "Palewood",
  "Runaway Sun",
  "Blueprint",
];

const CONTENT = {};
titles.forEach((title, i) => {
  const id = "c" + String(i + 1).padStart(2, "0");
  const g = genres[i % genres.length];
  CONTENT[id] = {
    id,
    title,
    year: 2019 + (i % 8),
    rating: ratings[i % ratings.length],
    durationLabel: durations[i % durations.length],
    genres: g,
    posterUrl: `https://picsum.photos/seed/${id}/300/450`,
    backdropUrl: `https://picsum.photos/seed/${id}/800/450`,
    videoUrl: videos[i % videos.length],
    description: `${title} follows a small group whose ordinary lives crack open when one decision pulls them somewhere they can't return from.`,
    cast: [1, 2, 3].map((n) => ({
      id: `${id}p${n}`,
      name: `Actor ${n}`,
      role: `Character ${n}`,
      photoUrl: `https://picsum.photos/seed/${id}p${n}/100/100`,
    })),
    relatedIds: [1, 2, 3, 4].map(
      (n) => "c" + String(((i + n) % 30) + 1).padStart(2, "0"),
    ),
  };
});

const out = `import type { ContentDetail } from "@/types/content";

export const CONTENT: Record<string, ContentDetail> = ${JSON.stringify(CONTENT, null, 2)};
`;
writeFileSync("src/data/content.ts", out);
console.log("wrote 30 items");
