import { customAlphabet } from "nanoid";
import { and, eq } from "drizzle-orm";
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

interface UpdateLinkData {
  originalUrl: string;
  customSlug?: string;
}

export async function updateLinkForUser(
  userId: string,
  linkId: number,
  data: UpdateLinkData
) {
  const customSlug = data.customSlug?.trim();

  const [link] = await db.db
    .update(links)
    .set({
      originalUrl: data.originalUrl,
      ...(customSlug ? { shortCode: customSlug } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  return link;
}

export async function deleteLinkForUser(userId: string, linkId: number) {
  const [link] = await db.db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  return link;
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db.db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode));

  return link;
}
