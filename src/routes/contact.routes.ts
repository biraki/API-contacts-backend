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
  ensureDataIsValidMiddleware(contactSchemaRequest),
  (req: Request, res: Response) => contactController.create(req, res)
);
contactRouter.get("", ensureAuthMiddleware, (req, res) =>
  contactController.list(req, res)
);
contactRouter.get("/:id", ensureIsContactOwnerMiddleware, (req, res) =>
  contactController.listByid(req, res)
);
contactRouter.patch(
  "/:id",
  ensureIsContactOwnerMiddleware,
  ensureDataIsValidMiddleware(contactSchemaUpdate),
  (req, res) => contactController.update(req, res)
);
contactRouter.delete(
  "/:id",
  ensureIsContactOwnerMiddleware,
  (req, res) => contactController.remove(req, res)
);
