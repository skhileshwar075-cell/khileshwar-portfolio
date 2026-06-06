import { Router, type IRouter } from "express";
import { eq, gte, sql } from "drizzle-orm";
import { db, analyticsTable, projectsTable } from "@workspace/db";
import { TrackEventBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/analytics/track", async (req, res): Promise<void> => {
  const parsed = TrackEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.insert(analyticsTable).values(parsed.data);
  res.status(201).json({ ok: true });
});

router.get("/analytics/summary", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now);
  monthStart.setDate(now.getDate() - 30);

  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsTable)
    .where(eq(analyticsTable.type, "page_view"));

  const [todayResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsTable)
    .where(sql`${analyticsTable.type} = 'page_view' AND ${analyticsTable.createdAt} >= ${todayStart}`);

  const [weekResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsTable)
    .where(sql`${analyticsTable.type} = 'page_view' AND ${analyticsTable.createdAt} >= ${weekStart}`);

  const [monthResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsTable)
    .where(sql`${analyticsTable.type} = 'page_view' AND ${analyticsTable.createdAt} >= ${monthStart}`);

  const [resumeResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsTable)
    .where(eq(analyticsTable.type, "resume_download"));

  const [contactResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsTable)
    .where(eq(analyticsTable.type, "contact_submit"));

  res.json({
    totalVisitors: Number(totalResult?.count ?? 0),
    todayVisitors: Number(todayResult?.count ?? 0),
    weeklyVisitors: Number(weekResult?.count ?? 0),
    monthlyVisitors: Number(monthResult?.count ?? 0),
    resumeDownloads: Number(resumeResult?.count ?? 0),
    contactSubmissions: Number(contactResult?.count ?? 0),
  });
});

router.get("/analytics/project-views", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const views = await db
    .select({
      projectId: analyticsTable.projectId,
      views: sql<number>`count(*)`,
    })
    .from(analyticsTable)
    .where(sql`${analyticsTable.type} = 'project_view' AND ${analyticsTable.projectId} IS NOT NULL`)
    .groupBy(analyticsTable.projectId);

  const projects = await db.select().from(projectsTable);
  const projectMap = new Map(projects.map((p) => [p.id, p.title]));

  const result = views
    .map((v) => ({
      projectId: v.projectId!,
      projectTitle: projectMap.get(v.projectId!) ?? "Unknown",
      views: Number(v.views),
    }))
    .sort((a, b) => b.views - a.views);

  res.json(result);
});

export default router;
