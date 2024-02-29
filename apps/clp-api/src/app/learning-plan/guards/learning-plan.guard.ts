import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INewLearningPlanPayload } from '@raise-clp/models';
import { Model } from 'mongoose';
import { LearningPlan, LearningPlanDocument } from '../learning-plan.schema';

@Injectable()
export class CreateLearningPlanGuard implements CanActivate {
    constructor(
        @InjectModel(LearningPlan.name)
        private learningPlanModel: Model<LearningPlanDocument>
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { questionnaireUrl }: INewLearningPlanPayload = request.body;
        const sameQuestionnaireLP = await this.learningPlanModel.find({
            questionnaireUrl
        });
        if (sameQuestionnaireLP) {
            throw new ConflictException('This questionnaire URL is already in use.');
        }

        return true;
    }
}
