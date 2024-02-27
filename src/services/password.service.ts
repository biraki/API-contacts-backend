import nodemailer from "nodemailer";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/users.entity";
import { AppError } from "../errors/AppError";
import { ResetPassword } from "../entities/resetPassword.entity";
import { hash } from "bcryptjs";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export class RecoverPasswordService {
  async sendEmail(data: string) {
    const email = data;
    const userRepository = AppDataSource.getRepository(User);
    const resetPasswordRepository = AppDataSource.getRepository(ResetPassword);
    const foundUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new AppError("Email not found", 404);
    }

    const token = sign({ email: email }, process.env.SECRET_KEY!, {
      expiresIn: "3h",
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperação de Senha",
        html: `<p>Clique no link abaixo para recuperar sua senha:</p><p><a href="http://localhost:5173/password/${token}">Recuperar Senha</a></p>`,
      });
      const resetPassword = resetPasswordRepository.create({
        token,
        user: foundUser,
      });
      await resetPasswordRepository.save(resetPassword);
      
      console.log(token)
  
    } catch (error: any) {
      console.error("Erro ao enviar e-mail de recuperação de senha:", error);
      throw new AppError(`Error sending recovery email: ${error.message}`, 500);
    }
  }

  async changePassword(token: string, newPassword: string) {
    const userRepository = AppDataSource.getRepository(User);
    const resetPasswordRepository = AppDataSource.getRepository(ResetPassword);

    const foundResetPassword = await resetPasswordRepository.findOne({
      where: {
        token: token,
      },
      relations: {
        user: true ,
      }
    });
    console.log(foundResetPassword)
    if(foundResetPassword == null){
      throw new AppError("Contact not found", 404);
    }

    const userId = foundResetPassword.user.id;
    const foundUser = await userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const hashedPassword = await hash(newPassword, 10);

    const updatePassword = userRepository.create({
      ...foundUser,
      password: hashedPassword,
    });
    await userRepository.save(updatePassword);
    await resetPasswordRepository.remove(foundResetPassword!);
  }
}
