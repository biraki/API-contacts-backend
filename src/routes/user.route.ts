import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { ensureDataIsValidMiddleware } from "../middlewares/ensureDataIsValid.middleware";
import { userSchemaRequest, userSchemaUpdate } from "../schemas/user.schema";
import { getDataFromToken } from "../middlewares/getDataFormToken.middleware";
import { ensureAuthMiddleware } from "../middlewares/ensureAuth.middleware";
import { ensureIsAccounttOwnerMiddleware } from "../middlewares/ensureIsAccountOwner.middleware";
import { isSuperUserMiddleware } from "../middlewares/isSuperUser.middleware";

export const userRouter = Router();

userRouter.post(
  "",
  ensureDataIsValidMiddleware(userSchemaRequest),
  (req: Request, res: Response) => userController.create(req, res)
);
userRouter.get(
  "/pdf/",
  ensureAuthMiddleware,
  getDataFromToken,
  isSuperUserMiddleware,
  (req, res) => userController.generatePdf(req, res)
);
userRouter.get(
  "/pdf/:id",
  ensureAuthMiddleware,
  getDataFromToken,
  ensureIsAccounttOwnerMiddleware,
  (req, res) => userController.generatePdfById(req, res)
);
userRouter.get(
  "/",
  ensureAuthMiddleware,
  getDataFromToken,
  isSuperUserMiddleware,
  (req, res) => userController.list(req, res)
);
userRouter.get(
  "/:id",
  ensureAuthMiddleware,
  getDataFromToken,
  ensureIsAccounttOwnerMiddleware,
  (req, res) => userController.listById(req, res)
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
