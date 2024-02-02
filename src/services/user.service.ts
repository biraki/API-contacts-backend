import { hash } from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities/users.entity";
import {
  TUser,
  TUserRequest,
  TUserResponse,
  TUserUpdateRequest,
} from "../interfaces/user.interface";
import {
  userSchema,
  userSchemaResponse,
  usersSchemaResponse,
} from "../schemas/user.schema";
import { AppError } from "../errors/AppError";

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
    if(!isSuperUser) {
      const user = await userRepository.findOne({
        where: {
          id: userId
        }
      })
      return userSchemaResponse.parse(user);
    }
    const users = await userRepository.find();
    return usersSchemaResponse.parse(users);
  }

  async update(
    data: TUserUpdateRequest,
    userId: string,
    username: string
  ): Promise<TUserResponse> {
    const userRepository = AppDataSource.getRepository(User);
    const userToUpdate = await userRepository.findOneBy({
      id: userId,
    });
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
      data.password = hashedPassword
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
}
