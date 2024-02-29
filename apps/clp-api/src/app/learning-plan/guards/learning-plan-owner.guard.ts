import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '@raise-clp/models';
import { Request } from 'express';
import { Model } from 'mongoose';
import { LearningPlan, LearningPlanDocument } from '../learning-plan.schema';

@Injectable()
export class LearningPlanOwnerGuard implements CanActivate {
    constructor(
        @InjectModel(LearningPlan.name)
        private learningPlanModel: Model<LearningPlanDocument>
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request & { user: Partial<IUser> } = context.switchToHttp().getRequest();
        const id = request.params['id'];
        const lp = (await this.learningPlanModel.findOne({ id })).toJSON();
        if (request.user.id !== lp.userId) {
            throw new ForbiddenException('This operation is not allowed.');
        }

        return true;
    }
}
