import { config } from '@config';
import { UserI } from '@user';
import nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

export class AuthHelper {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mailing.email,
      pass: config.mailing.password,
    },
  });

  resetPasswordTemplate(user: UserI, url: string) {
    const from = config.mailing.email;
    const to = user.email;
    const subject = '🎧 XSMusic - Reseteo de contraseña 🎧';
    const html = `
        <p>Ey ${user.name},</p>
        <p>Parece que has perdido la contraseña de XSMusic, ¡vaya!</p>
        <p>Sigue este enlace para resetear tu contraseña:</p>
        <a href=${url}>${url}</a>
        <p>Este enlace se autodestruirá en una hora</p>
        <p>XSMusic Team</p>
    `;

    return { from, to, subject, html };
  }

  usePasswordHashToMakeToken(user: UserI) {
    const secret = user.password + '-' + user.created;
    const token = jwt.sign({ user: user._id }, secret, {
      expiresIn: 3600, // 1 hour
    });
    return token;
  }
}
