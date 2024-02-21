import { Injectable } from '@nestjs/common';
import * as jsonLogic from 'json-logic-js';
import { CustomLearningPlan } from './models/custom-learning-plan.model';
import { Data, PaperFormQuestionType, PaperformSubmissionDto } from './models/paperform-submission.dto';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { LearningPlanService } from './learning-plan/learning-plan.service';
import { MailService } from './mail/mail.service';
import { Submission, SubmissionDocument } from './submission/submission.schema';

const deriveValue = (question: Data) => {
    switch (question?.type) {
        case PaperFormQuestionType.rank:
            return question.value?.join('\n');
        case PaperFormQuestionType.matrix:
            question.value?.shift();
            return question.value?.map((option) => option[1])?.join();
        default:
            return question.value;
    }
};

@Injectable()
export class AppService {
    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
        private readonly learningPlanService: LearningPlanService,
        private readonly mailService: MailService,
        @InjectModel(Submission.name)
        private readonly submissionModel: Model<SubmissionDocument>
    ) {}

    async processQuestionnaireSubmission(
        name: string,
        email: string,
        submission: PaperformSubmissionDto
    ): Promise<boolean> {
        const normalizedData = this.normalizeData(submission);
        const clp = await this.evaluateRules(normalizedData, submission.slug);
        const wpUserId = submission.data.find(
            (question) => question.custom_key === this.config.get('USER_ID_KEY')
        )?.value;

        // Send mail to questionnaire sender
        if (email && this.config.get('MAIL_TO_SENDER_ACTIVE')) this.mailService.sendClpMail(name, email, clp);

        // Send mail to admin
        const mailAddresses = this.config.get('MAIL_TO_ADMINS')?.split(' ');
        if (this.config.get('MAIL_TO_ADMINS'))
            this.mailService.sendClpAdminMail(name, wpUserId, mailAddresses, clp);

        // Safe data and CLP
        const submissionEntity = new Submission(submission, clp);
        await this.submissionModel.create(submissionEntity);

        // Talk to WP
        const lp = (await this.learningPlanService.findLatest(submission.slug))?.toObject();

        const requestData = clp.chapters.map((chapter) => ({
            lessonId: chapter.lessonId,
            optional: chapter.recommendation
        }));
        const request = this.httpService.post(`${lp.lpOptionalUrl}/${wpUserId}`, requestData);

        await firstValueFrom(request);

        return true;
    }

    public normalizeData(submission: PaperformSubmissionDto) {
        return submission.data.reduce((acc, question) => {
            const value = deriveValue(question);
            return { ...acc, [question.custom_key ?? question.key]: value };
        }, {});
    }

    public async evaluateRules(normalizedData: unknown, formSlug: string) {
        const customLearningPlan: CustomLearningPlan = new CustomLearningPlan();

        const lp = (await this.learningPlanService.findLatest(formSlug))?.toObject();

        console.log('>> LATEST LEARNING PLAN');
        console.log(JSON.stringify(lp, null, 2));

        lp.chapters.forEach((chapter) => {
            chapter.units.forEach((unit) => {
                if (!unit.rule)
                    customLearningPlan.chapters.push({
                        title: unit.title,
                        recommendation: false,
                        lessonId: unit.id
                    });
                else {
                    const chapterWithRule = {
                        title: unit.title,
                        recommendation: jsonLogic.apply(unit.rule, normalizedData),
                        lessonId: unit.id
                    };
                    customLearningPlan.chapters.push(chapterWithRule);
                }
            });
        });

        return customLearningPlan;
    }
}
