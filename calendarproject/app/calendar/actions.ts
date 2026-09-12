"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLinkForUser, updateLinkForUser, deleteLinkForUser } from "@/data/links";

const createLinkSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  customSlug: z
    .string()
    .trim()
    .min(3, "Custom slug must be at least 3 characters")
    .max(50, "Custom slug must be at most 50 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Custom slug can only contain letters, numbers, hyphens and underscores")
    .optional()
    .or(z.literal("")),
});

const updateLinkSchema = createLinkSchema.extend({
  id: z.number().int().positive(),
});

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

interface CreateLinkInput {
  originalUrl: string;
  customSlug?: string;
}

interface UpdateLinkInput {
  id: number;
  originalUrl: string;
  customSlug?: string;
}

interface DeleteLinkInput {
  id: number;
}

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = createLinkSchema.parse(input);
    const link = await createLinkForUser(userId, {
      originalUrl: validated.originalUrl,
      customSlug: validated.customSlug || undefined,
    });
    revalidatePath("/calendar");
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Invalid input data" };
    }
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "That custom slug is already taken" };
    }
    return { error: "Failed to create link" };
  }
}

export async function updateLink(input: UpdateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = updateLinkSchema.parse(input);
    const link = await updateLinkForUser(userId, validated.id, {
      originalUrl: validated.originalUrl,
      customSlug: validated.customSlug || undefined,
    });
    if (!link) {
      return { error: "Link not found" };
    }
    revalidatePath("/calendar");
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Invalid input data" };
    }
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "That custom slug is already taken" };
    }
    return { error: "Failed to update link" };
  }
}

export async function deleteLink(input: DeleteLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = deleteLinkSchema.parse(input);
    const link = await deleteLinkForUser(userId, validated.id);
    if (!link) {
      return { error: "Link not found" };
    }
    revalidatePath("/calendar");
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Invalid input data" };
    }
    return { error: "Failed to delete link" };
  }
}
