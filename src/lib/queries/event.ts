"use server";

import { db } from "@/db/drizzle";
import type { EventRow, PublicEvent } from "@/db/schema";

export async function getEvents(clerkUserId: string): Promise<EventRow[]> {
  const events = await db.query.event.findMany({
    where: ({ clerkUserId: userIdCol }, { eq }) => eq(userIdCol, clerkUserId),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  return events;
}

export async function getEvent(
  userId: string,
  eventId: string,
): Promise<EventRow | undefined> {
  const event = await db.query.event.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)),
  });

  return event ?? undefined;
}

export async function getPublicEvents(
  clerkUserId: string,
): Promise<PublicEvent[]> {
  const events = await db.query.event.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  return events as PublicEvent[];
}
