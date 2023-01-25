import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { CustomLearningPlan } from '../models/custom-learning-plan.model';
import { PaperformSubmissionDto } from '../models/paperform-submission.dto';

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema()
export class Submission {
  @Prop(PaperformSubmissionDto)
  @Type(() => PaperformSubmissionDto)
  questionnaire: PaperformSubmissionDto;

  @Prop(CustomLearningPlan)
  @Type(() => CustomLearningPlan)
  clp: CustomLearningPlan;

  constructor(questionnaire: PaperformSubmissionDto, clp: CustomLearningPlan) {
    this.questionnaire = questionnaire;
    this.clp = clp;
  }
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
