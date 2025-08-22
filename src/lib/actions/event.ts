"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/drizzle";
import { event } from "@/db/schema/event";
import { getErrorMessage } from "../handle-error";
import { type EventFormSchema, eventFormSchema } from "../validations/event";

export async function createEvent(unsafeData: EventFormSchema): Promise<void> {
  try {
    const { userId } = await auth();

    const { success, data } = eventFormSchema.safeParse(unsafeData);

    if (!success || !userId) {
      throw new Error("Invalid event data or user not authenticated.");
    }

    await db.insert(event).values({ ...data, clerkUserId: userId });
  } catch (error) {
    throw new Error(`Failed to create event: ${getErrorMessage(error)}`);
  } finally {
    revalidatePath("/events");
  }
}

export async function updateEvent(
  id: string,
  unsafeData: EventFormSchema,
): Promise<void> {
  try {
    const { userId } = await auth();

    const { success, data } = eventFormSchema.safeParse(unsafeData);

    if (!success || !userId) {
      throw new Error("Invalid event data or user not authenticated.");
    }

    const { rowCount } = await db
      .update(event)
      .set({ ...data })
      .where(and(eq(event.id, id), eq(event.clerkUserId, userId)));

    if (rowCount === 0) {
      throw new Error(
        "Event not found or user not authorized to update this event.",
      );
    }
  } catch (error) {
    throw new Error(`Failed to update event: ${getErrorMessage(error)}`);
  } finally {
    revalidatePath("/events");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const { rowCount } = await db
      .delete(event)
      .where(and(eq(event.id, id), eq(event.clerkUserId, userId)));

    if (rowCount === 0) {
      throw new Error(
        "Event not found or user not authorized to delete this event.",
      );
    }
  } catch (error) {
    throw new Error(`Failed to delete event: ${getErrorMessage(error)}`);
  } finally {
    revalidatePath("/events");
  }
}
