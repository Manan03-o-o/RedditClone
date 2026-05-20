import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
  });
};
