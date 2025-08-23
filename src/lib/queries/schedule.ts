"use server";

import {
  addMinutes,
  areIntervalsOverlapping,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  setHours,
  setMinutes,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import type { DAYS_OF_WEEK_IN_ORDER } from "@/lib/constants";
import { getCalendarEventTimes } from "@/lib/google-calendar";

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

function getAvailabilities(
  groupedAvailabilities: Partial<
    Record<
      (typeof DAYS_OF_WEEK_IN_ORDER)[number],
      (typeof scheduleAvailability.$inferSelect)[]
    >
  >,
  date: Date,
  timezone: string,
): { start: Date; end: Date }[] {
  const dayOfWeek = (() => {
    if (isMonday(date)) return "monday";
    if (isTuesday(date)) return "tuesday";
    if (isWednesday(date)) return "wednesday";
    if (isThursday(date)) return "thursday";
    if (isFriday(date)) return "friday";
    if (isSaturday(date)) return "saturday";
    if (isSunday(date)) return "sunday";
    return null;
  })();

  if (!dayOfWeek) return [];

  const dayAvailabilities = groupedAvailabilities[dayOfWeek];

  if (!dayAvailabilities) return [];

  return dayAvailabilities.map(({ startTime, endTime }) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);

    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = fromZonedTime(
      setMinutes(setHours(date, startHour), startMinute),
      timezone,
    );

    const end = fromZonedTime(
      setMinutes(setHours(date, endHour), endMinute),
      timezone,
    );

    return { start, end };
  });
}

export async function getValidTimesFromSchedule(
  timesInOrder: Date[],
  event: { clerkUserId: string; durationInMinutes: number },
): Promise<Date[]> {
  const { clerkUserId: userId, durationInMinutes } = event;

  const start = timesInOrder[0];
  const end = timesInOrder.at(-1);

  if (!start || !end) return [];

  const schedule = await getSchedule(userId);

  if (schedule == null) return [];

  const groupedAvailabilities = Object.groupBy(
    schedule.availabilities,
    (a) => a.dayOfWeek,
  );

  const eventTimes = await getCalendarEventTimes(userId, {
    start,
    end,
  });

  return timesInOrder.filter((intervalDate) => {
    const availabilities = getAvailabilities(
      groupedAvailabilities,
      intervalDate,
      schedule.timezone,
    );

    const eventInterval = {
      start: intervalDate,
      end: addMinutes(intervalDate, durationInMinutes),
    };

    return (
      eventTimes.every((eventTime) => {
        return !areIntervalsOverlapping(eventTime, eventInterval);
      }) &&
      availabilities.some((availability) => {
        return (
          isWithinInterval(eventInterval.start, availability) &&
          isWithinInterval(eventInterval.end, availability)
        );
      })
    );
  });
}
