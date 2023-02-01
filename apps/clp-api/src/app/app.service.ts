import { Injectable } from '@nestjs/common';
import * as jsonLogic from 'json-logic-js';
import { CustomLearningPlan } from './models/custom-learning-plan.model';
import {
  Data,
  PaperFormQuestionType,
  PaperformSubmissionDto,
} from './models/paperform-submission.dto';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom, forkJoin } from 'rxjs';
import { LearningPlanService } from './learning-plan/learning-plan.service';
import { MailService } from './mail/mail.service';
import { Submission, SubmissionDocument } from './submission/submission.schema';

const deriveValue = (question: Data) => {
  switch (question?.type) {
    case PaperFormQuestionType.rank:
      return question.value?.join();
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
    const clp = await this.evaluateRules(normalizedData);
    await this.mailService.sendClpMail(name, email, clp);

    // TODO: Safe data and CLP
    const submissionEntity = new Submission(submission, clp);
    await this.submissionModel.create(submissionEntity);

    // TODO: Talk to WP
    const wpUserId = submission.data.find(
      (question) => question.custom_key === this.config.get('USER_ID_KEY')
    )?.value;
    const chaptersToSkip = clp.chapters.filter(
      (chapter) => !chapter.recommendation
    );
    const chaptersToDo = clp.chapters.filter(
      (chapter) => chapter.recommendation
    );

    const lp = (await this.learningPlanService.findLatest())?.toObject();

    const requests = [
      ...chaptersToDo.map((chapter) => {
        return this.httpService.get(
          `${lp.removeOptionalUrl}/${wpUserId}/${chapter.lessonId}`
        );
      }),
      ...chaptersToSkip.map((chapter) =>
        this.httpService.get(
          `${lp.addOptionalUrl}/${wpUserId}/${chapter.lessonId}`
        )
      ),
    ];

    await firstValueFrom(forkJoin(requests));

    return true;
  }

  private normalizeData(submission: PaperformSubmissionDto) {
    return submission.data.reduce((acc, question) => {
      const value = deriveValue(question);
      return { ...acc, [question.custom_key ?? question.key]: value };
    }, {});
  }

  private async evaluateRules(normalizedData: unknown) {
    const customLearningPlan: CustomLearningPlan = new CustomLearningPlan();

    const lp = (await this.learningPlanService.findLatest())?.toObject();
    lp.chapters.forEach((chapter) => {
      chapter.units.forEach((unit) => {
        if (!unit.rule)
          customLearningPlan.chapters.push({
            title: unit.title,
            recommendation: false,
            lessonId: unit.id,
          });
        else {
          customLearningPlan.chapters.push({
            title: unit.title,
            recommendation: jsonLogic.apply(unit.rule, normalizedData),
            lessonId: unit.id,
          });
        }
      });
    });

    return customLearningPlan;
  }
}
