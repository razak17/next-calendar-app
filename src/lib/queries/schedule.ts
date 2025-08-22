"use server";

import { db } from "@/db/drizzle";
import type { schedule, scheduleAvailability } from "@/db/schema";

type ScheduleRow = typeof schedule.$inferSelect;
type AvailabilityRow = typeof scheduleAvailability.$inferSelect;

type FullSchedule = ScheduleRow & { availabilities: AvailabilityRow[] };

export async function getSchedule(userId: string): Promise<FullSchedule> {
  const schedule = await db.query.schedule.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    with: {
      availabilities: true,
    },
  });
  return schedule as FullSchedule;
}
