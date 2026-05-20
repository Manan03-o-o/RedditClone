import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const decoded = verifyToken(token) as { id: string; email: string; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token) as { id: string; email: string; username: string };
      req.user = decoded;
    }
  } catch (error) {
    // Token invalid, continue without user
  }
  next();
};
