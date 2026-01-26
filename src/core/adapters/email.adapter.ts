import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { UserAccountsConfig } from '../../modules/user-accounts/config/user-accounts.config';

@Injectable()
export class EmailAdapter {
  private readonly user: string;
  private readonly password: string;

  constructor(private readonly userAccountsConfig: UserAccountsConfig) {
    this.user = this.userAccountsConfig.userGmail;
    this.password = this.userAccountsConfig.userGmailPassword;
  }

  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.user,
        pass: this.password,
      },
    });

    try {
      await transporter.sendMail({
        from: `Vlad Mirage <${this.user}>`,
        to: email,
        subject: 'Code registration my sait',
        html: template(code),
      });
    } catch (e) {
      console.log('Send email error' + e);
    }

    return true;
  }
}
