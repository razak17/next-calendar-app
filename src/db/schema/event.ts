import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const event = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // event name
    description: text("description"), // optional description
    durationInMinutes: integer("durationInMinutes").notNull(), // duration of the event
    clerkUserId: text("clerkUserId").notNull(), // ID of the user who created it (from Clerk)
    isActive: boolean("isActive").notNull().default(true), // whether the event is currently active
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("clerkUserIdIndex").on(table.clerkUserId), // index on clerkUserId for faster querying
  ],
);

export type EventRow = typeof event.$inferSelect;
