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

  public sendClpMail(
    name: string,
    email: string | string[],
    clp: CustomLearningPlan
  ) {
    const skipableChapters = clp.chapters.filter(
      (chapter) => chapter.recommendation
    );
    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('SMTP_SENDER'),
        sender: this.configService.get('SMTP_SENDER'),
        subject: '[RAISE] Your custom learning plan is ready ✔',
        text: JSON.stringify({
          ...clp,
          chapters: skipableChapters,
        }),
        template: './clp',
        context: {
          name: name,
          chapters: skipableChapters,
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

  public sendClpAdminMail(
    name: string,
    id: string,
    email: string | string[],
    clp: CustomLearningPlan
  ) {
    const skipableChapters = clp.chapters.filter(
      (chapter) => chapter.recommendation
    );
    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('SMTP_SENDER'),
        sender: this.configService.get('SMTP_SENDER'),
        subject: `[RAISE] A custom learning plan has been generated for ${
          name ?? 'unknown'
        } (ID: ${id})`,
        text: JSON.stringify({
          ...clp,
          chapters: skipableChapters,
        }),
        template: './clp-admin',
        context: {
          participantName: name ?? 'unknown',
          participantId: id,
          chapters: skipableChapters,
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
