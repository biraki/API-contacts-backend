import { hash } from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities/users.entity";
import {
  TUserRequest,
  TUserResponse,
  TUserUpdateRequest,
} from "../interfaces/user.interface";
import {
  userSchemaResponse,
  usersSchemaResponse,
} from "../schemas/user.schema";
import { AppError } from "../errors/AppError";
import jsPDF from "jspdf";

export class UserService {
  async create(data: TUserRequest): Promise<TUserResponse> {
    const { email, password, name, superUser, phone } = data;
    const userRepository = AppDataSource.getRepository(User);
    const foundUserByEmail = await userRepository.findOne({
      where: {
        email,
      },
    });

    const foundUserByPhone = await userRepository.findOne({
      where: {
        phone,
      },
    });

    if (foundUserByEmail && foundUserByPhone) {
      throw new AppError("Email and phone already exist");
    }

    if (foundUserByEmail) {
      throw new AppError("Email already exists");
    }

    if (foundUserByPhone) {
      throw new AppError("Phone already exists");
    }

    const hashedPassword = await hash(password, 10);
    const user: User = userRepository.create({
      email,
      name,
      superUser,
      password: hashedPassword,
      phone,
    });
    await userRepository.save(user);
    return userSchemaResponse.parse(user);
  }

  async list(isSuperUser: boolean, userId: string) {
    const userRepository = AppDataSource.getRepository(User);
    if (userId) {
      const user = await userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          contacts: true,
        },
      });
      return userSchemaResponse.parse(user);
    }
    if (!userId && isSuperUser) {
      const users = await userRepository.find({
        relations: {
          contacts: true,
        },
      });
      return usersSchemaResponse.parse(users);
    }

    throw new AppError("Insufficient permissions", 403);
  }

  async update(
    data: TUserUpdateRequest,
    userId: string,
    username: string
  ): Promise<TUserResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const userToUpdate = await userRepository.findOne({
      where: { id: userId },
      relations: {
        contacts: true,
      },
    });
    if (!userToUpdate) {
      throw new AppError("User not found", 404);
    }

    for (var info in data) {
      if (info == "email") {
        const foundContact = await userRepository.findOne({
          where: {
            email: data.email!,
          },
        });
        if (foundContact) {
          throw new AppError("Email already exists");
        }
      } else if (info == "phone") {
        const foundContact = await userRepository.findOne({
          where: {
            phone: data.phone!,
          },
        });
        if (foundContact) {
          throw new AppError("Phone already exists");
        }
      }
    }

    if (data.password) {
      const hashedPassword = await hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedUserData = userRepository.create({
      ...userToUpdate,
      ...data,
      updatedBy: username,
      updatedAt: new Date(),
    });
    await userRepository.save(updatedUserData);
    return userSchemaResponse.parse(updatedUserData);
  }

  async remove(userId: string): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const userToDelete = await userRepository.findOneBy({
      id: userId,
    });
    if (!userToDelete) {
      throw new AppError("User not found", 404);
    }
    await userRepository.remove(userToDelete);
  }

  async getPdf(isSuperUser: boolean, userId: string) {

    const userRepository = AppDataSource.getRepository(User);
    let users: User[] = [];
    if (userId) {
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
      users.push(user);
    }

    if (!userId && isSuperUser) {
      const users = await userRepository.find({
        relations: {
          contacts: true,
        },
      });
    }

    const pdfDoc = new jsPDF({ orientation: "p" });

    users.forEach(async (user) => {
      pdfDoc.addPage();
      pdfDoc.setFontSize(10);
      pdfDoc.setFont("times");
      pdfDoc.setTextColor("#232020");
      pdfDoc.text(`Name: ${user?.name}`, 10, 10);
      pdfDoc.text(`Email: ${user?.email}`, 10, 20);
      pdfDoc.text(`Contatos:`, 10, 30);
      let y = 40;
      let count = 0;
      user?.contacts.map((contact) => {
        for (const [key, value] of Object.entries(contact)) {
          if (count == 6) {
            pdfDoc.addPage();
            count = -1;
            y = 10;
          }
          if (
            key == "name" ||
            key == "phone" ||
            key == "optionalPhone" ||
            key == "email" ||
            key == "optionalEmail" ||
            key == "status"
          ) {
            pdfDoc.text(`${key}: ${value}`, 10, y);
            y += 5;
            if (key == "status") {
              y += 10;
            }
          }
        }

        count += 1;
      });

      // Converte o documento PDF para bytes
    });
    pdfDoc.deletePage(1);
    const pdfBytes = pdfDoc.output("arraybuffer");
    const pdf = new Blob([pdfBytes], { type: "application/pdf" });

    return await pdf.text();
  }
}
