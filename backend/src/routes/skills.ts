import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, skillsTable } from "@workspace/db";
import {
  CreateSkillBody,
  UpdateSkillParams,
  UpdateSkillBody,
  DeleteSkillParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/skills", async (_req, res): Promise<void> => {
  const skills = await db.select().from(skillsTable).orderBy(skillsTable.category, skillsTable.name);
  res.json(skills);
});

router.post("/skills", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [skill] = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(skill);
});

router.patch("/skills/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = UpdateSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [skill] = await db
    .update(skillsTable)
    .set(parsed.data)
    .where(eq(skillsTable.id, params.data.id))
    .returning();

  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.json(skill);
});

router.delete("/skills/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [skill] = await db
    .delete(skillsTable)
    .where(eq(skillsTable.id, params.data.id))
    .returning();

  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
