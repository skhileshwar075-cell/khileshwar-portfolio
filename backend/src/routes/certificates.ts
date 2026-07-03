import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, certificatesTable } from "@workspace/db";
import {
  CreateCertificateBody,
  UpdateCertificateParams,
  UpdateCertificateBody,
  DeleteCertificateParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/certificates", async (_req, res): Promise<void> => {
  const certs = await db
    .select()
    .from(certificatesTable)
    .orderBy(desc(certificatesTable.featured), desc(certificatesTable.createdAt));
  res.json(certs);
});

router.post("/certificates", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateCertificateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [cert] = await db.insert(certificatesTable).values(parsed.data).returning();
  res.status(201).json(cert);
});

router.patch("/certificates/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = UpdateCertificateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCertificateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [cert] = await db
    .update(certificatesTable)
    .set(parsed.data)
    .where(eq(certificatesTable.id, params.data.id))
    .returning();

  if (!cert) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }

  res.json(cert);
});

router.delete("/certificates/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteCertificateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [cert] = await db
    .delete(certificatesTable)
    .where(eq(certificatesTable.id, params.data.id))
    .returning();

  if (!cert) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
