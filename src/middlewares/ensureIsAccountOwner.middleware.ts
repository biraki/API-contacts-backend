import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AppError } from "../errors/AppError";
import { User } from "../entities/users.entity";

export const ensureIsAccounttOwnerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = AppDataSource.getRepository(User);
  
  const userParamId = req.params.id;
  const userId = res.locals.userId;
  const superUser = res.locals.superUser;

  const user = await userRepository.findOne({
    where: {
      id: userParamId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!superUser) {
    if(userParamId){
      if (user.id !== userId) {
        throw new AppError("Insufficient permissions", 403);
      }
      return next();
    }
  }
  return next();
};
