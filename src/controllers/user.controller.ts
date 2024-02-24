import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { TUserUpdateRequest } from "../interfaces/user.interface";


export class UserController {
  constructor(private userService: UserService) {}
  async create(req: Request, res: Response) {
    const newUser = await this.userService.create(req.body);
    return res.status(201).json(newUser);
  }

  async list(req: Request, res: Response) {
    const users = await this.userService.list();
    return res.json(users);
  }

  async listById(req: Request, res: Response) {
    const users = await this.userService.listById(req.params.id);
    return res.json(users);
  }

  async update(req: Request, res: Response) {
    const userId = req.params.id;
    const userData: TUserUpdateRequest = req.body;
    const tokenId: string = res.locals.userId;
    const updatedContact = await this.userService.update(
      userData,
      userId,
      tokenId
    );
    return res.json(updatedContact);
  }

  async remove(req: Request, res: Response) {
    const userId = req.params.id;
    await this.userService.remove(userId);
    return res.status(204).send();
  }

  async generatePdf(req: Request, res: Response) {
    const userId = res.locals.userId
    const superUser = res.locals.superUser
    console.log(userId)
    console.log(superUser)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user_contacts.pdf"
    );
    const users = await this.userService.getPdf(userId, superUser);
    return res.end(users, "binary");
  }

  async generatePdfById(req: Request, res: Response) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user_contacts.pdf"
    );
    const users = await this.userService.getPdfById(req.params.id);
    return res.end(users, "binary");
  }
}
