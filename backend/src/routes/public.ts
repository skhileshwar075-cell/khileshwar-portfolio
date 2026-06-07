import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, projectsTable, skillsTable, certificatesTable, experienceTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/public/summary", async (_req, res): Promise<void> => {
  const [[projects], [skills], [certificates], [experience]] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(projectsTable),
    db.select({ count: sql<number>`count(*)` }).from(skillsTable),
    db.select({ count: sql<number>`count(*)` }).from(certificatesTable),
    db.select({ count: sql<number>`count(*)` }).from(experienceTable),
  ]);

  res.json({
    totalProjects: Number(projects?.count ?? 0),
    totalSkills: Number(skills?.count ?? 0),
    totalCertificates: Number(certificates?.count ?? 0),
    totalExperience: Number(experience?.count ?? 0),
  });
});

export default router;
