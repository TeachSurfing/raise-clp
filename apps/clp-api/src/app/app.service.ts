import { Injectable } from '@nestjs/common';
import * as jsonLogic from 'json-logic-js';
import { CustomLearningPlan } from './models/custom-learning-plan.model';
import {
  Data,
  PaperFormQuestionType,
  PaperformSubmissionDto,
} from './models/paperform-submission.dto';

import { LearningPlanService } from './learning-plan/learning-plan.service';
import { MailService } from './mail/mail.service';

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
    private readonly learningPlanService: LearningPlanService,
    private readonly mailService: MailService
  ) {}

  async processQuestionnaireSubmission(
    name: string,
    email: string,
    submission: PaperformSubmissionDto
  ): Promise<void> {
    const normalizedData = this.normalizeData(submission);
    const clp = await this.evaluateRules(normalizedData);
    this.mailService.sendClpMail(name, email, clp);
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
          });
        else {
          customLearningPlan.chapters.push({
            title: unit.title,
            recommendation: jsonLogic.apply(unit.rule, normalizedData),
          });
        }
      });
    });

    return customLearningPlan;
  }
}
