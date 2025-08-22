import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { DAYS_OF_WEEK_IN_ORDER } from "@/lib/constants";

import { schedule } from "./schedule";

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const scheduleAvailability = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => schedule.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => [index("scheduleIdIndex").on(table.scheduleId)],
);

export const scheduleAvailabilityRelations = relations(
  scheduleAvailability,
  ({ one }) => ({
    schedule: one(schedule, {
      fields: [scheduleAvailability.scheduleId],
      references: [schedule.id],
    }),
  }),
);

export type ScheduleAvailabilityRow = typeof scheduleAvailability.$inferSelect;
