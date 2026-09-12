import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/db";
import { links } from "@/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { CreateLinkDialog } from "@/app/calendar/create-link-dialog";

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await db.db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(links.createdAt);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <CreateLinkDialog />
      </div>

      <h2 className="mb-2 text-lg font-medium">Your Links</h2>

      {userLinks.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t created any links yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {userLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <CardTitle>{link.shortCode}</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-primary hover:underline"
                >
                  {link.originalUrl}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
