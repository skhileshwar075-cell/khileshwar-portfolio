import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsQueryParams,
  CreateBlogPostBody,
  GetBlogPostParams,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  DeleteBlogPostParams,
  GetBlogPostBySlugParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const query = ListBlogPostsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions: SQL[] = [];

  if (query.data.published !== undefined) {
    conditions.push(eq(blogPostsTable.published, query.data.published));
  } else if (!req.isAuthenticated()) {
    conditions.push(eq(blogPostsTable.published, true));
  }

  if (query.data.category) {
    conditions.push(eq(blogPostsTable.category, query.data.category));
  }

  let posts = await db
    .select()
    .from(blogPostsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(blogPostsTable.createdAt);

  if (query.data.search) {
    const s = query.data.search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(s)),
    );
  }

  if (query.data.tag) {
    const tag = query.data.tag;
    posts = posts.filter((p) => p.tags && (p.tags as string[]).includes(tag));
  }

  res.json(posts);
});

router.post("/blog", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = {
    ...parsed.data,
    publishedAt: parsed.data.published ? new Date() : null,
  };

  const [post] = await db.insert(blogPostsTable).values(data).returning();
  res.status(201).json(post);
});

router.get("/blog/slug/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(post);
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(post);
});

router.patch("/blog/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id));

  if (!existing[0]) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.published && !existing[0].publishedAt) {
    updateData.publishedAt = new Date();
  }

  const [post] = await db
    .update(blogPostsTable)
    .set(updateData)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();

  res.json(post);
});

router.delete("/blog/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
