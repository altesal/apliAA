import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div>
      <h1>Calendar</h1>
    </div>
  );
}
