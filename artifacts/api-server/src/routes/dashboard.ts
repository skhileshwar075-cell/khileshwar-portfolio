import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import {
  db,
  projectsTable,
  skillsTable,
  blogPostsTable,
  certificatesTable,
  contactsTable,
  analyticsTable,
  experienceTable,
  educationTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [[projects], [skills], [blog], [certs], [contacts], [visitors], [unread], [featured], [published], [drafts], [resumeDownloads], [experience], [education]] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(projectsTable),
      db.select({ count: sql<number>`count(*)` }).from(skillsTable),
      db.select({ count: sql<number>`count(*)` }).from(blogPostsTable),
      db.select({ count: sql<number>`count(*)` }).from(certificatesTable),
      db.select({ count: sql<number>`count(*)` }).from(contactsTable),
      db.select({ count: sql<number>`count(*)` }).from(analyticsTable).where(eq(analyticsTable.type, "page_view")),
      db.select({ count: sql<number>`count(*)` }).from(contactsTable).where(eq(contactsTable.read, false)),
      db.select({ count: sql<number>`count(*)` }).from(projectsTable).where(eq(projectsTable.featured, true)),
      db.select({ count: sql<number>`count(*)` }).from(blogPostsTable).where(eq(blogPostsTable.published, true)),
      db.select({ count: sql<number>`count(*)` }).from(blogPostsTable).where(eq(blogPostsTable.published, false)),
      db.select({ count: sql<number>`count(*)` }).from(analyticsTable).where(eq(analyticsTable.type, "resume_download")),
      db.select({ count: sql<number>`count(*)` }).from(experienceTable),
      db.select({ count: sql<number>`count(*)` }).from(educationTable),
    ]);

  res.json({
    totalProjects: Number(projects?.count ?? 0),
    totalSkills: Number(skills?.count ?? 0),
    totalBlogPosts: Number(blog?.count ?? 0),
    totalCertificates: Number(certs?.count ?? 0),
    totalContacts: Number(contacts?.count ?? 0),
    totalVisitors: Number(visitors?.count ?? 0),
    unreadContacts: Number(unread?.count ?? 0),
    featuredProjects: Number(featured?.count ?? 0),
    publishedPosts: Number(published?.count ?? 0),
    draftPosts: Number(drafts?.count ?? 0),
    resumeDownloads: Number(resumeDownloads?.count ?? 0),
    totalExperience: Number(experience?.count ?? 0),
    totalEducation: Number(education?.count ?? 0),
  });
});

export default router;
