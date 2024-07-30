import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost', 
      port: 1025, 
      secure: false, 
    });
  }

   async sendPasswprdResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:4200/reset-password?token=${token}`

    const mailOptions = {
      from: 'no-reply@localhost',
      to: to,
      subject: 'Recuperanción de clave',
      html: `<p> Solicitaste la recuperación de tu clave. Tu código de recuperacion es:</p>
      <p>${token}</p>
    
      <p> Entra al siguiente enlace para recuperar tu contraseña: <a href="${resetLink}"> Has clic acá </a></p>`,
    };

     await this.transporter.sendMail(mailOptions);
  }


  async sendActivationEmail(to: string, token: string) {
    const resetLink = `http://localhost:4200/activate-account?token=${token}`

    const mailOptions = {
      from: 'no-reply@localhost',
      to: to,
      subject: 'Activación de la cuenta',
      html: `<p> Para acticar tu cuenta de AULA VIRTUAL </p>
    
      <p> Entra al siguiente enlace: <a href="${resetLink}"> Haz clic acá </a></p>`,
    };

     await this.transporter.sendMail(mailOptions);
  }
}
