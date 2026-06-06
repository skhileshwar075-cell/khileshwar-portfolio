import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, experienceTable } from "@workspace/db";
import {
  CreateExperienceBody,
  UpdateExperienceParams,
  UpdateExperienceBody,
  DeleteExperienceParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/experience", async (_req, res): Promise<void> => {
  const experience = await db.select().from(experienceTable).orderBy(experienceTable.createdAt);
  res.json(experience);
});

router.post("/experience", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateExperienceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [exp] = await db.insert(experienceTable).values(parsed.data).returning();
  res.status(201).json(exp);
});

router.patch("/experience/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = UpdateExperienceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateExperienceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [exp] = await db
    .update(experienceTable)
    .set(parsed.data)
    .where(eq(experienceTable.id, params.data.id))
    .returning();

  if (!exp) {
    res.status(404).json({ error: "Experience not found" });
    return;
  }

  res.json(exp);
});

router.delete("/experience/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteExperienceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [exp] = await db
    .delete(experienceTable)
    .where(eq(experienceTable.id, params.data.id))
    .returning();

  if (!exp) {
    res.status(404).json({ error: "Experience not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
