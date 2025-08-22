import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { scheduleAvailability } from "./schedule-availability";

export const schedule = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const scheduleRelations = relations(schedule, ({ many }) => ({
  availabilities: many(scheduleAvailability),
}));

export type ScheduleRow = typeof schedule.$inferSelect;
