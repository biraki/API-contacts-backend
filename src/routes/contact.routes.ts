import { Request, Response, Router } from "express";
import { contactController } from "../controllers";
import { ensureDataIsValidMiddleware } from "../middlewares/ensureDataIsValid.middleware";
import {
  contactSchemaRequest,
  contactSchemaUpdate,
} from "../schemas/contact.schema";
import { ensureIsContactOwnerMiddleware } from "../middlewares/ensureIsContactOwner.middleware";
import { ensureAuthMiddleware } from "../middlewares/ensureAuth.middleware";
import { getDataFromToken } from "../middlewares/getDataFormToken.middleware";

export const contactRouter = Router();

contactRouter.use(ensureAuthMiddleware, getDataFromToken);
contactRouter.post(
  "",
  ensureAuthMiddleware,
  ensureDataIsValidMiddleware(contactSchemaRequest),
  (req: Request, res: Response) => contactController.create(req, res)
);
contactRouter.get("", (req, res) => contactController.list(req, res));
contactRouter.patch(
  "/:id",
  ensureAuthMiddleware,
  getDataFromToken,
  ensureIsContactOwnerMiddleware,
  ensureDataIsValidMiddleware(contactSchemaUpdate),
  (req, res) => contactController.update(req, res)
);
contactRouter.delete(
  "/:id",
  ensureAuthMiddleware,
  getDataFromToken,
  ensureIsContactOwnerMiddleware,
  (req, res) => contactController.remove(req, res)
);
