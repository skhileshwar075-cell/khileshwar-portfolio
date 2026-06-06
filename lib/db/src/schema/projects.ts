import { pgTable, text, serial, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description"),
  problemStatement: text("problem_statement"),
  solution: text("solution"),
  features: text("features"),
  techStack: json("tech_stack").$type<string[]>().default([]),
  githubUrl: text("github_url"),
  liveDemoUrl: text("live_demo_url"),
  featured: boolean("featured").notNull().default(false),
  category: text("category").notNull().default("web"),
  status: text("status").notNull().default("completed"),
  thumbnailUrl: text("thumbnail_url"),
  screenshotUrls: json("screenshot_urls").$type<string[]>().default([]),
  demoVideoUrl: text("demo_video_url"),
  challenges: text("challenges"),
  futureScope: text("future_scope"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
