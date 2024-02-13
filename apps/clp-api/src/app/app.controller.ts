import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { PaperformSubmissionDto } from './models/paperform-submission.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly config: ConfigService) {}

    @Public()
    @Post('submission')
    @HttpCode(204)
    async processQuestionnaireSubmission(@Body() submission: PaperformSubmissionDto) {
        let email: string;
        let name: string;

        if (JSON.parse(this.config.get('MAIL_TO_SENDER_ACTIVE'))) {
            const emailQuestion = submission.data.find(
                (question) => question.custom_key === this.config.get('EMAIL_KEY')
            );
            const nameQuestion = submission.data.find(
                (question) => question.custom_key === this.config.get('NAME_KEY')
            );

            email = emailQuestion?.value;
            name = nameQuestion?.value;

            if (!email)
                throw new HttpException(
                    'Invalid Request - Email field must be available',
                    HttpStatus.BAD_REQUEST
                );
        }

        return this.appService.processQuestionnaireSubmission(name, email, submission);
    }
}
