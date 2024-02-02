import { Router } from "express";
import { sessionController } from "../controllers";

export const sessionRouter = Router()

sessionRouter.post("", (req, res) => sessionController.login(req, res))
