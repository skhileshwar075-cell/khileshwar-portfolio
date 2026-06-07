import { Router, type IRouter, type Request, type Response } from "express";
import { signSession, validateAdminCredentials, SESSION_TTL } from "../lib/auth";

const router: IRouter = Router();

router.get("/auth/user", (req: Request, res: Response) => {
  res.json({ user: (req as any).user ?? null });
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: "email and password required" });
    return;
  }

  const user = await validateAdminCredentials(email, password);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signSession({ user });
  res.cookie("sid", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });

  res.json({ ok: true });
});

router.post("/auth/logout", async (req: Request, res: Response) => {
  res.clearCookie("sid", { path: "/" });
  res.json({ ok: true });
});

export default router;
