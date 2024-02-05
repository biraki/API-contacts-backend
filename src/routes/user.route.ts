import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { ensureDataIsValidMiddleware } from "../middlewares/ensureDataIsValid.middleware";
import { userSchemaRequest, userSchemaUpdate } from "../schemas/user.schema";
import { getDataFromToken } from "../middlewares/getDataFormToken.middleware";
import { ensureAuthMiddleware } from "../middlewares/ensureAuth.middleware";
import { ensureIsAccounttOwnerMiddleware } from "../middlewares/ensureIsAccountOwner.middleware";

export const userRouter = Router();

userRouter.post(
  "",
  ensureDataIsValidMiddleware(userSchemaRequest),
  (req: Request, res: Response) => userController.create(req, res)
);
userRouter.get("", ensureAuthMiddleware, getDataFromToken, (req, res) =>
  userController.list(req, res)
);
userRouter.patch(
  "/:id",
  ensureAuthMiddleware,
  getDataFromToken,
  ensureIsAccounttOwnerMiddleware,
  ensureDataIsValidMiddleware(userSchemaUpdate),
  (req, res) => userController.update(req, res)
);
userRouter.delete(
  "/:id",
  ensureAuthMiddleware,
  getDataFromToken,
  ensureIsAccounttOwnerMiddleware,
  (req, res) => userController.remove(req, res)
);
userRouter.get("/pdf", ensureAuthMiddleware, getDataFromToken, ensureIsAccounttOwnerMiddleware, (req, res) => userController.generatePdf(req, res))
