import { clerkClient } from "@clerk/nextjs/server";
import { AlertTriangle } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import { getEvent } from "@/lib/queries/event";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ clerkUserId: string; eventId: string }>;
  searchParams: Promise<{ startTime: string }>;
}) {
  const { clerkUserId, eventId } = await params;
  const { startTime } = await searchParams;

  const event = await getEvent(clerkUserId, eventId);

  if (!event)
    return (
      <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
        <AlertTriangle className="h-5 w-5" />
        <span>This event doesn't exist anymore.</span>
      </div>
    );

  const client = await clerkClient();
  const calendarUser = await client.users.getUser(clerkUserId);

  const startTimeDate = new Date(startTime);

  return (
    <Card className="mx-auto max-w-xl border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
      <CardHeader>
        <CardTitle>
          ✅ Successfully Booked {event.name} with {calendarUser.fullName}
        </CardTitle>
        <CardDescription>{formatDateTime(startTimeDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        You should receive an email confirmation shortly. You can safely close
        this page now.
      </CardContent>
    </Card>
  );
}
