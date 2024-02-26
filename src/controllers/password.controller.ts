import { Request, Response } from "express";
import { RecoverPasswordService } from "../services/password.service";

export class RecoveryPasswordController {
    constructor(private sessionService: RecoverPasswordService) { }

    async post(req: Request, res: Response) {
        const email = req.body.email
        const senEmail = await this.sessionService.sendEmail(email)
        return res.status(200).json({ message: "Email send"})
    }

    async update(req: Request, res: Response) {

        const resetPassword = await this.sessionService.changePassword(req.params.token, req.body.password)
        return res.status(200).json({ message: "Password changed"})
    }
}
