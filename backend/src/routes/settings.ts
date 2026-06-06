import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const [existing] = await db.select().from(settingsTable);
  if (existing) return existing;

  const [created] = await db.insert(settingsTable).values({
    siteTitle: "My Portfolio",
    siteDescription: "Full Stack Developer & AI-Assisted Developer",
    heroText: "Building the future, one line at a time",
    heroSubtext: "CS Graduate | Full Stack Developer | AI Enthusiast",
    ownerName: "Portfolio Owner",
    ownerTitle: "Full Stack Developer",
  }).returning();

  return created;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

router.patch("/settings", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await getOrCreateSettings();

  const [settings] = await db
    .update(settingsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(settingsTable.id, existing.id))
    .returning();

  res.json(settings);
});

export default router;
