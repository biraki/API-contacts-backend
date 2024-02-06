import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export const isSuperUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const superUser = res.locals.superUser;

  if (!superUser) {
    throw new AppError("Insufficient permissions", 403);
  }
  return next();
};
