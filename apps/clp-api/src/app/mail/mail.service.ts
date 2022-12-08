import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLearningPlan } from '../models/custom-learning-plan.model';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  public sendClpMail(name: string, email: string, clp: CustomLearningPlan) {
    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('SMTP_SENDER'),
        subject: '[RAISE] Your custom learning plan is ready ✔',
        text: JSON.stringify(clp),
        template: './clp',
        context: {
          name: name,
          chapters: clp.chapters,
        },
      })
      .catch((error: Error) => {
        console.error(error);

        throw new HttpException(
          'Internal Server Error ',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }
}
