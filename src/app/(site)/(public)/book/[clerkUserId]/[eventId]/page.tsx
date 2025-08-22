import { clerkClient } from "@clerk/nextjs/server";
import {
  addYears,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns";
import { AlertTriangle } from "lucide-react";

import { getEvent } from "@/lib/queries/event";
import { getValidTimesFromSchedule } from "@/lib/queries/schedule";

import MeetingForm from "@/components/meeting-form";
import NoTimeSlots from "@/components/no-time-slots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ clerkUserId: string; eventId: string }>;
}) {
  const { clerkUserId, eventId } = await params;

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

  const startDate = roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: "ceil",
  });

  const endDate = endOfDay(addYears(startDate, 1));

  const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
    event,
  );

  if (validTimes.length === 0) {
    return <NoTimeSlots event={event} calendarUser={calendarUser} />;
  }

  return (
    <Card className="mx-auto max-w-4xl border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
      <CardHeader>
        <CardTitle>
          Book {event.name} with {calendarUser.fullName}
        </CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <MeetingForm
          validTimes={validTimes}
          eventId={event.id}
          clerkUserId={clerkUserId}
        />
      </CardContent>
    </Card>
  );
}
