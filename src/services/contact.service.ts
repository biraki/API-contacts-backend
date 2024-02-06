import { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { Contact } from "../entities/contact.entity";
import { User } from "../entities/users.entity";
import { AppError } from "../errors/AppError";
import {
  TContact,
  TContactRequest,
  TContactUpdateRequest,
  TContactsResponse,
} from "../interfaces/contact.interface";
import {
  contactSchema,
  contactsSchemaResponse,
} from "../schemas/contact.schema";

export class ContactService {
  async create(data: TContactRequest, userId: string): Promise<TContact> {
    const contactRepository = AppDataSource.getRepository(Contact);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const foundContactByEmail = await contactRepository.findOne({
      where: {
        email: data.email,
      },
    });

    const foundContactByPhone = await contactRepository.findOne({
      where: {
        phone: data.phone,
      },
    });

    if (foundContactByEmail && foundContactByPhone) {
      throw new AppError("Email and phone already exist",409);
    }

    if (foundContactByEmail) {
      throw new AppError("Email already exists",409);
    }

    if (foundContactByPhone) {
      throw new AppError("Phone already exists",409);
    }

    const task = contactRepository.create({
      ...data,
      user,
    });

    await contactRepository.save(task);
    return contactSchema.parse(task);
  }

  async list(userId: string, isSuperUser: boolean): Promise<TContactsResponse> {

    if (!isSuperUser) {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          contacts: true,
        },
      });
      if (!user) {
        throw new AppError("User not found", 404);
      }
      return contactsSchemaResponse.parse(user.contacts);
    }
    const contactRepository = AppDataSource.getRepository(Contact);
    const contacts = await contactRepository.find();
    return contactsSchemaResponse.parse(contacts);
  }

  async listById(
    contactId: string
  ): Promise<TContact> {
    const contactRepository = AppDataSource.getRepository(Contact);
    const contactToRetrieve = await contactRepository.findOneBy({
      id: contactId,
    });
    if (!contactToRetrieve) {
      throw new AppError("Contact not found", 404);
    }
    return contactSchema.parse(contactToRetrieve)
  }

  async update(
    data: TContactUpdateRequest,
    contactId: string,
    username: string
  ): Promise<TContact> {
    const contactRepository = AppDataSource.getRepository(Contact);
    const contactToUpdate = await contactRepository.findOneBy({
      id: contactId,
    });
    if (!contactToUpdate) {
      throw new AppError("Contact not found", 404);
    }

    for (var info in data) {
      if (info == "email") {
        const foundContact = await contactRepository.findOne({
          where: {
            email: data.email!,
          },
        });
        if (foundContact) {
          throw new AppError("Email already exists",409);
        }
      } else if (info == "phone") {
        const foundContact = await contactRepository.findOne({
          where: {
            phone: data.phone!,
          },
        });
        if (foundContact) {
          throw new AppError("Phone already exists",409);
        }
      }
    }
    const updatedContactData = contactRepository.create({
      ...contactToUpdate,
      ...data,
      updatedBy: username,
      updatedAt: new Date(),
    });
    await contactRepository.save(updatedContactData);
    return contactSchema.parse(updatedContactData);
  }

  async remove(contactId: string): Promise<void> {
    const contactRepository = AppDataSource.getRepository(Contact);
    const contactToDelete = await contactRepository.findOneBy({
      id: contactId,
    });
    if (!contactToDelete) {
      throw new AppError("Contact not found", 404);
    }
    await contactRepository.remove(contactToDelete);
  }
}
