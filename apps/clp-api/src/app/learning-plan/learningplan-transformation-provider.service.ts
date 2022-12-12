import { Injectable } from '@nestjs/common';
import { LearningPlan } from './learning-plan.schema';

@Injectable()
export abstract class LearningplanTransformationProvider {
  abstract transform(data: unknown): Promise<LearningPlan>;
}
