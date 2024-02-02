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
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync } from "fs";

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
    if (!isSuperUser) {
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
    const users = await userRepository.find({
      relations: {
        contacts: true,
      },
    });
    return usersSchemaResponse.parse(users);
  }

  async update(
    data: TUserUpdateRequest,
    userId: string,
    username: string
  ): Promise<TUserResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const userToUpdate = await userRepository.findOne({
      where: {id: userId},
      relations: {
        contacts: true,
      },
    },);
    if (!userToUpdate) {
      throw new AppError("Contact not found", 404);
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
      throw new AppError("Contact not found", 404);
    }
    await userRepository.remove(userToDelete);
  }

  async getPdf(isSuperUser: boolean, userId: string) {
    const userRepository = AppDataSource.getRepository(User);

    try {
      let users;

      if (!isSuperUser) {
        const user = await userRepository.findOne({
          where: {
            id: userId,
          },
          relations: {
            contacts: true,
          },
        });

        users = [user];
      } else {
        users = await userRepository.find({
          relations: {
            contacts: true,
          },
        });
      }

      // Cria um novo documento PDF
      const pdfDoc = await PDFDocument.create();

      // Adiciona uma nova página ao documento
      const page = pdfDoc.addPage();

      
      // Adiciona os dados dos usuários à página

      // const text = users
      //   .map((user) => {
      //     return `Nome: ${user!.name}, Email: ${
      //       user!.email
      //     }, Contacts: ${JSON.stringify(user!.contacts)}`;
      //   })
      //   .join("\n");
            const text = users
            .map((user) => {
          if (!user){return }
          return `Nome: ${user.name}, Email: ${
            user.email
          }, Contacts: ${(user.contacts.map((info) => {
            return `Nome: ${info.name}, Email: ${info.email}, Optional Email: ${info.optionalEmail},
             Phone: ${info.phone}, Optional Phone: ${info.optionalPhone}, Since: ${info.registeredAt},`
          }) )}`;
        })
        .join("\n");
      const { width, height } = page.getSize()
      const fontSize = 10
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      page.drawText(text, {
        x: 50,
        y: height - 4 * fontSize,
        maxWidth: 100,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0.35, 0.32, 0.32),
      })

      // Converte o documento PDF para bytes
      const pdfBytes = await pdfDoc.save();
      writeFileSync('usuarios.pdf', pdfBytes);
      return pdfBytes;
    } catch (error) {
      console.error("Error to generate PDF:", error);
      throw new AppError("Internal Server Error");
    }
  }
}
