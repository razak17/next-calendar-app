"use server";

import { fromZonedTime } from "date-fns-tz";

import { db } from "@/db/drizzle";
import { createCalendarEvent } from "../google-calendar";
import { getErrorMessage } from "../handle-error";
import { getValidTimesFromSchedule } from "../queries/schedule";
import {
  type MeetingActionSchema,
  meetingActionSchema,
} from "../validations/meeting";

export async function createMeeting(unsafeData: MeetingActionSchema) {
  try {
    const { success, data } = meetingActionSchema.safeParse(unsafeData);

    if (!success) {
      throw new Error("Invalid data.");
    }

    const event = await db.query.event.findFirst({
      where: ({ clerkUserId, isActive, id }, { eq, and }) =>
        and(
          eq(isActive, true),
          eq(clerkUserId, data.clerkUserId),
          eq(id, data.eventId),
        ),
    });

    if (!event) {
      throw new Error("Event not found.");
    }

    const startInTimezone = fromZonedTime(data.startTime, data.timezone);

    const validTimes = await getValidTimesFromSchedule(
      [startInTimezone],
      event,
    );

    if (validTimes.length === 0) {
      throw new Error("Selected time is not valid.");
    }

    await createCalendarEvent({
      ...data,
      startTime: startInTimezone,
      durationInMinutes: event.durationInMinutes,
      eventName: event.name,
    });
    return {
      clerkUserId: data.clerkUserId,
      eventId: data.eventId,
      startTime: data.startTime,
    };
  } catch (error) {
    console.error(`Error creating meeting: ${getErrorMessage(error)}`);

    throw new Error(`Failed to create meeting: ${getErrorMessage(error)}`);
  }
}
