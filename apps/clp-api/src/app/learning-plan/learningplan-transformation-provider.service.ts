import { Injectable } from '@nestjs/common';
import { LearningPlan } from './learning-plan.schema';

@Injectable()
export abstract class LearningplanTransformationProvider {
  abstract transform(url: string): Promise<LearningPlan>;
}
