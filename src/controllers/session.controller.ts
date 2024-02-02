import { Request, Response } from "express";
import { SessionService } from "../services/session.service";

export class SessionController {
    constructor(private sessionService: SessionService) { }
    async login(req: Request, res: Response) {
        const token = await this.sessionService.createToken(req.body)
        return res.json({token})
    }
}
