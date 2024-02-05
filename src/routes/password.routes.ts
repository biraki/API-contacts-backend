import { Router } from "express";
import { recoveryPasswordController, sessionController } from "../controllers";

export const passwordRouter = Router()

passwordRouter.post("", (req, res) => recoveryPasswordController.post(req, res))
