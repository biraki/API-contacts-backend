import { Request, Response } from "express";
import { RecoverPasswordService } from "../services/password.service";
import { TUserRecoveryPasswordRequest } from "../interfaces/user.interface";

export class RecoveryPasswordController {
    constructor(private sessionService: RecoverPasswordService) { }
    async post(req: Request, res: Response) {
        const email = await this.sessionService.sendEmail(req.body)
        return res.status(200).json({ message: "Email send"})
    }
}
