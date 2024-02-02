import { Response, Request, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";

export const handleAppErrorMiddlieware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Bad Request", fieldErrors: error.flatten().fieldErrors });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
