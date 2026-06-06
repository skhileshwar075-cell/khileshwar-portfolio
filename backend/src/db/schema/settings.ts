import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title"),
  siteDescription: text("site_description"),
  metaKeywords: text("meta_keywords"),
  heroText: text("hero_text"),
  heroSubtext: text("hero_subtext"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  resumeUrl: text("resume_url"),
  ownerName: text("owner_name"),
  ownerTitle: text("owner_title"),
  ownerBio: text("owner_bio"),
  avatarUrl: text("avatar_url"),
  primaryColor: text("primary_color"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
