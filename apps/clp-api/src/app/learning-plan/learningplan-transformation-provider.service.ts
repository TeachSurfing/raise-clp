import { Injectable } from '@nestjs/common';
import { INewLearningPlan } from '@raise-clp/models';
import { LearningPlan } from './learning-plan.schema';

@Injectable()
export abstract class LearningplanTransformationProvider {
    abstract transform(data: INewLearningPlan): Promise<LearningPlan>;
}
