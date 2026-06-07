import { type Request, type Response, type NextFunction } from "express";
import { verifySession, getSessionId } from "../lib/auth";
import type { AuthUser } from "@workspace/api-zod";

declare global {
  namespace Express {
    interface User extends AuthUser {}

    interface Request {
      isAuthenticated(): this is AuthedRequest;

      user?: User | undefined;
    }

    export interface AuthedRequest {
      user: User;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.isAuthenticated = function (this: Request) {
    return this.user != null;
  } as Request["isAuthenticated"];

  const token = getSessionId(req);
  if (!token) {
    next();
    return;
  }

  const session = verifySession(token);
  if (!session?.user?.id) {
    next();
    return;
  }

  req.user = session.user;
  next();
}
