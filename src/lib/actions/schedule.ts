"use server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { revalidatePath } from "next/cache";

import {
  type ScheduleFormSchema,
  scheduleFormSchema,
} from "@/lib/validations/schedule";

import { db } from "@/db/drizzle";
import { schedule, scheduleAvailability } from "@/db/schema";
import { getErrorMessage } from "../handle-error";

export async function saveSchedule(unsafeData: ScheduleFormSchema) {
  try {
    const { userId } = await auth();

    const { success, data } = scheduleFormSchema.safeParse(unsafeData);

    if (!success || !userId) {
      throw new Error("Invalid schedule data or user not authenticated.");
    }

    const { availabilities, ...scheduleData } = data;

    const [{ id: scheduleId }] = await db
      .insert(schedule)
      .values({ ...scheduleData, clerkUserId: userId })
      .onConflictDoUpdate({
        target: schedule.clerkUserId,
        set: scheduleData,
      })
      .returning({ id: schedule.id });

    const statements: [BatchItem<"pg">] = [
      db
        .delete(scheduleAvailability)
        .where(eq(scheduleAvailability.scheduleId, scheduleId)),
    ];

    if (availabilities.length > 0) {
      statements.push(
        db.insert(scheduleAvailability).values(
          availabilities.map((availability) => ({
            ...availability,
            scheduleId,
          })),
        ),
      );
    }

    await db.batch(statements);
    revalidatePath("/schedule");
  } catch (error) {
    throw new Error(`Failed to save schedule: ${getErrorMessage(error)}`);
  }
}
