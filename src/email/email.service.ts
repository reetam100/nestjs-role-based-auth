import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { ApiError } from 'src/common/utils/api-error';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(
    to: string,
    subject: string,
    templateId: string,
    dynamicData: Record<string, any>,
  ) {
    const msg = {
      to,
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        'noreply@yourdomain.com',
      subject,
      templateId,
      dynamic_template_data: dynamicData,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Email sent successfully to ${to}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error(
        '❌ Error sending email:',
        error.response?.body || error.message,
      );
      throw new ApiError(400, 'Error sending email');
    }
  }
}
