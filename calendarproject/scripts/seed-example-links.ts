import "dotenv/config";
import db from "../db";
import { links, type NewLink } from "../db/schema";

const exampleLinks: NewLink[] = [
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    shortCode: "mdn-js",
    createdAt: new Date("2026-09-01T09:15:00Z"),
    updatedAt: new Date("2026-09-01T09:15:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://nextjs.org/docs",
    shortCode: "next-docs",
    createdAt: new Date("2026-09-02T11:30:00Z"),
    updatedAt: new Date("2026-09-02T11:30:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://orm.drizzle.team/docs/overview",
    shortCode: "drizzle-docs",
    createdAt: new Date("2026-09-03T14:05:00Z"),
    updatedAt: new Date("2026-09-03T14:05:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://neon.tech/docs/introduction",
    shortCode: "neon-docs",
    createdAt: new Date("2026-09-04T08:45:00Z"),
    updatedAt: new Date("2026-09-04T08:45:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://clerk.com/docs/quickstarts/nextjs",
    shortCode: "clerk-nextjs",
    createdAt: new Date("2026-09-05T16:20:00Z"),
    updatedAt: new Date("2026-09-05T16:20:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://tailwindcss.com/docs/installation",
    shortCode: "tw-install",
    createdAt: new Date("2026-09-06T10:00:00Z"),
    updatedAt: new Date("2026-09-06T10:00:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://react.dev/learn",
    shortCode: "react-learn",
    createdAt: new Date("2026-09-07T13:40:00Z"),
    updatedAt: new Date("2026-09-07T13:40:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://www.typescriptlang.org/docs/handbook/intro.html",
    shortCode: "ts-handbook",
    createdAt: new Date("2026-09-08T07:25:00Z"),
    updatedAt: new Date("2026-09-08T07:25:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://vercel.com/docs",
    shortCode: "vercel-docs",
    createdAt: new Date("2026-09-09T18:10:00Z"),
    updatedAt: new Date("2026-09-09T18:10:00Z"),
  },
  {
    userId: "user_3J0j2ZnO5wLYkn40T9GK9GeQB4b",
    originalUrl: "https://github.com/features/actions",
    shortCode: "gh-actions",
    createdAt: new Date("2026-09-10T12:50:00Z"),
    updatedAt: new Date("2026-09-10T12:50:00Z"),
  },
];

async function seed() {
  await db.db.insert(links).values(exampleLinks);
  console.log(`Seeded ${exampleLinks.length} links`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
