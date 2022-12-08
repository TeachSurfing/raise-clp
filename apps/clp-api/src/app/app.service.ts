import { Injectable } from '@nestjs/common';
import * as jsonLogic from 'json-logic-js';
import { CustomLearningPlan } from './models/custom-learning-plan.model';
import { PaperformSubmissionDto } from './models/paperform-submission.dto';

import { LearningPlanService } from './learning-plan/learning-plan.service';
import { MailService } from './mail/mail.service';

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
      const value = question.value;
      if (question.type === 'matrix' && Array.isArray(value)) {
        value.shift();
        const mappedValue = value.map((val) => {
          return val[1];
        });

        const mapping = mappedValue.reduce(
          (innerAcc, val, counter) => ({
            ...innerAcc,
            [`${question.custom_key}_${counter}`]: val,
          }),
          {}
        );

        return { ...acc, ...mapping };
      }

      return { ...acc, [question.custom_key]: value };
    }, {});
  }

  private async evaluateRules(normalizedData: unknown) {
    const customLearningPlan: CustomLearningPlan = new CustomLearningPlan();

    const lp = (await this.learningPlanService.find(18045))?.toObject();

    lp.chapters.forEach((chapter) => {
      chapter.units.forEach((unit) => {
        if (!unit.rule)
          customLearningPlan.chapters.push({
            title: unit.title,
            recommendation: false,
          });
        else
          customLearningPlan.chapters.push({
            title: unit.title,
            recommendation: jsonLogic.apply(unit.rule, normalizedData),
          });
      });
    });

    return customLearningPlan;
  }
}
