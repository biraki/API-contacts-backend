import { Request, Response } from "express";
import { ContactService } from "../services/contact.service";
import { TContactUpdateRequest } from "../interfaces/contact.interface";
import { boolean } from "zod";

export class ContactController {
  constructor(private contactService: ContactService) {}
  async create(req: Request, res: Response) {
    const userId = res.locals.userId
    const newContact = await this.contactService.create(req.body, userId)
    return res.status(201).json(newContact);
  }

  async list(req: Request, res: Response) {
    const userId = res.locals.userId
    const isSuperUser = res.locals.superUser
    const contacts = await this.contactService.list(userId, isSuperUser);
    return res.json(contacts);
  }

  async update(req: Request, res: Response) {
    const contactId = req.params.id
    const contactData: TContactUpdateRequest = req.body
    const username: string = res.locals.username;
    const updatedContact = await this.contactService.update(contactData, contactId, username);
    console.log(updatedContact)
    return res.json(updatedContact);
  }

  async remove(req: Request, res: Response) {
    const contactId = req.params.id
    await this.contactService.remove(contactId);
    return res.status(204).send();
  }
}
