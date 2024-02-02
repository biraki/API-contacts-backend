import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { JwtPayload, verify } from "jsonwebtoken";

export const getDataFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    throw new AppError("Missing Token", 401);
  }

  const [_, token] = tokenHeader!.split(" ");
  const decodedToken = verify(token, process.env.SECRET_KEY!) as JwtPayload;

  const superUser = decodedToken.superUser;
  const username = decodedToken.username;

  res.locals.username = username;
  res.locals.superUser = superUser;

  return next();
};
