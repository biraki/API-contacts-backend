import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { TUserUpdateRequest } from "../interfaces/user.interface";
import { AppDataSource } from "../data-source";
import { User } from "../entities/users.entity";
import { createReadStream } from "fs";
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import doc from "pdfkit";

export class UserController {
  constructor(private userService: UserService) {}
  async create(req: Request, res: Response) {
    const newUser = await this.userService.create(req.body);
    return res.status(201).json(newUser);
  }

  async list(req: Request, res: Response) {
    const isSuperUser = res.locals.superUser
    const userId = req.params.id || res.locals.userId
    const users = await this.userService.list(isSuperUser, userId);
    return res.json(users);
  }

  async update(req: Request, res: Response) {
    const userId = req.params.id
    const userData: TUserUpdateRequest = req.body
    const username: string = res.locals.username;
    const updatedContact = await this.userService.update(userData, userId, username);
    return res.json(updatedContact);
  }

  async remove(req: Request, res: Response) {
    const userId = req.params.id
    await this.userService.remove(userId);
    return res.status(204).send();
  }

  async generatePdf(req: Request, res: Response) {
    const isSuperUser = res.locals.superUser || false
    const userId = req.params.id
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=user_contacts.pdf');
    const users = await this.userService.getPdf(isSuperUser, userId);
    return res.end(users, "binary")
  }


}

