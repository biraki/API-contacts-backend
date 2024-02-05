import nodemailer from "nodemailer";
import { TUserRecoveryPasswordRequest } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/users.entity";
import { AppError } from "../errors/AppError";

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
  async sendEmail(data: TUserRecoveryPasswordRequest) {
    const { email } = data;

    const userRepository = AppDataSource.getRepository(User);
    const foundUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new AppError("Email not found", 403);
    }

    const token = sign({ email: email }, process.env.SECRET_KEY!, {
      expiresIn: "3h",
    });

    console.log(process.env.EMAIL_PASS);

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperação de Senha",
        html: `<p>Clique no link abaixo para recuperar sua senha:</p><p><a href="http://seu-app.com/nova-senha?token=${token}">Recuperar Senha</a></p>`,
      });

      console.log("Email enviado:", info.messageId);
    } catch (error: any) {
      console.error("Erro ao enviar e-mail de recuperação de senha:", error);
      throw new AppError(`Error sending recovery email: ${error.message}`, 500);
    }
  }
}
