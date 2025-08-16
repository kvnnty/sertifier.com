import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send a basic templated email
   */
  async sendTemplateEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
    from?: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from,
      subject,
      template,
      context,
    });
  }

  /**
   * Send raw HTML email (no template)
   */
  async sendRawHtmlEmail(
    to: string,
    subject: string,
    html: string,
    from?: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from,
      subject,
      html,
    });
  }
}
