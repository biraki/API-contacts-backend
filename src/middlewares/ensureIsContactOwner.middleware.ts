import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Contact } from "../entities/contact.entity";
import { AppError } from "../errors/AppError";

export const ensureIsContactOwnerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contactRepository = AppDataSource.getRepository(Contact);

  const contactId = req.params.id;
  const userId = res.locals.userId;
  const superUser = res.locals.superUser;

  const contact = await contactRepository.findOne({
    where: {
      id: contactId,
    },
    relations: {
      user: true,
    },
  });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  if (!superUser) {
    if (contact.user.id !== userId) {
      throw new AppError("Insufficient permissions", 403);
    }
    return next();
  }

  return next();
};
