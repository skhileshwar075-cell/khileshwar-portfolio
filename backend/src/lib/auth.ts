import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";
import { db } from "@workspace/db";
import { adminsTable } from "@workspace/db";
import type { AuthUser } from "@workspace/api-zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE = "sid";
export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

const JWT_SECRET = process.env.SESSION_SECRET ?? process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Allow startup, but JWT functions will throw if secret missing
}

export interface SessionData {
  user: AuthUser;
  iat?: number;
  exp?: number;
}

export function signSession(data: SessionData): string {
  if (!JWT_SECRET) throw new Error("SESSION_SECRET or JWT_SECRET must be set");
  return jwt.sign(data, JWT_SECRET, { expiresIn: SESSION_TTL / 1000 });
}

export function verifySession(token: string): SessionData | null {
  if (!JWT_SECRET) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionData;
    return payload;
  } catch {
    return null;
  }
}

export async function validateAdminCredentials(email: string, password: string) {
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email));
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash as string);
  if (!ok) return null;
  const user: AuthUser = {
    id: admin.id,
    username: admin.email ?? admin.id,
    firstName: null,
    lastName: null,
    profileImage: null,
  };
  return user;
}

export function getSessionId(req: Request): string | undefined {
  const authHeader = req.headers["authorization"] as string | undefined;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies?.[SESSION_COOKIE];
}
