import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, educationTable } from "@workspace/db";
import {
  CreateEducationBody,
  UpdateEducationParams,
  UpdateEducationBody,
  DeleteEducationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/education", async (_req, res): Promise<void> => {
  const education = await db.select().from(educationTable).orderBy(educationTable.createdAt);
  res.json(education);
});

router.post("/education", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateEducationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [edu] = await db.insert(educationTable).values(parsed.data).returning();
  res.status(201).json(edu);
});

router.patch("/education/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = UpdateEducationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateEducationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [edu] = await db
    .update(educationTable)
    .set(parsed.data)
    .where(eq(educationTable.id, params.data.id))
    .returning();

  if (!edu) {
    res.status(404).json({ error: "Education not found" });
    return;
  }

  res.json(edu);
});

router.delete("/education/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteEducationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [edu] = await db
    .delete(educationTable)
    .where(eq(educationTable.id, params.data.id))
    .returning();

  if (!edu) {
    res.status(404).json({ error: "Education not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
