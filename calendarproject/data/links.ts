import { customAlphabet } from "nanoid";
import db from "@/db";
import { links } from "@/db/schema";

const generateShortCode = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  8
);

interface CreateLinkData {
  originalUrl: string;
  customSlug?: string;
}

export async function createLinkForUser(userId: string, data: CreateLinkData) {
  const shortCode = data.customSlug?.trim() || generateShortCode();

  const [link] = await db.db
    .insert(links)
    .values({
      userId,
      originalUrl: data.originalUrl,
      shortCode,
    })
    .returning();

  return link;
}
