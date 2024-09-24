import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const productions = pgTable("productions", {
  channelId: text("channelId").primaryKey(),
  channelName: text("channelName").notNull(),
  description: text("description").notNull(),
  closetLocation: text("closetLocation").notNull(),
  eventLocation: text("eventLocation").notNull(),
  closetTime: timestamp("closetTime").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  volunteerEmbedId: text("volunteerEmbedID").notNull(),
  unVolunteerEmbedId: text("unVolunteerEmbedID").notNull(),
});

export const volunteers = pgTable("volunteers", {
  userId: text("userId"),
  channelId: text("channelId").references(() => productions.channelId)
});
