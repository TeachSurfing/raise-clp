import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INewLearningPlan, INewLearningPlanPayload } from '@raise-clp/models';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LearningPlan, LearningPlanDocument } from './learning-plan.schema';
import { LearningplanTransformationProvider } from './learningplan-transformation-provider.service';

@Injectable()
export class LearningPlanService {
    constructor(
        @InjectModel(LearningPlan.name)
        private learningPlanModel: Model<LearningPlanDocument>,
        private learningPlanService: LearningplanTransformationProvider
    ) {}

    async findAll(userId: string) {
        return await this.learningPlanModel.find({ userId }).exec();
    }

    async findOne(id: string) {
        return await this.learningPlanModel.findOne({ id }).exec();
    }

    async deleteOne(id: string) {
        return await this.learningPlanModel.deleteOne({ id }).exec();
    }

    async findLatest(userId: string) {
        return (await this.learningPlanModel.find({ userId }).exec()).pop();
    }

    async addLearningPlan(data: INewLearningPlanPayload, userId: string) {
        const lp: INewLearningPlan = { ...data, userId };
        const newLearningPlan = await this.learningPlanService.transform(lp);
        newLearningPlan.id = uuidv4();

        return await this.learningPlanModel.create(newLearningPlan);
    }

    async updateLearningPlan(id: string) {
        const oldLearningPlan = await this.findOne(id);
        const newLearningPlan = await this.learningPlanService.transform({
            ...oldLearningPlan
        });
        newLearningPlan.id = id;

        newLearningPlan.chapters = newLearningPlan.chapters.map((chapter) => {
            return {
                ...chapter,
                units: chapter.units.map((unit) => ({
                    ...unit,
                    rule: oldLearningPlan.chapters
                        .find((findChapter) => findChapter.id === chapter.id)
                        ?.units.find((findUnit) => findUnit.id === unit.id)?.rule
                }))
            };
        });

        return await this.learningPlanModel.findOneAndUpdate({ id: newLearningPlan.id }, newLearningPlan, {
            new: true,
            upsert: true
        });
    }

    async getQuestions(id: string) {
        return await (
            await this.learningPlanModel.findOne({ id: id })
        ).questions;
    }

    async updateChapterRule(courseId: number, chapterId: number, rule: any) {
        return await this.learningPlanModel.findOneAndUpdate(
            { id: courseId },
            { $set: { 'chapters.$[chapter].rule': rule } },
            {
                new: true,
                upsert: true,
                arrayFilters: [{ 'chapter.id': chapterId }]
            }
        );
    }

    public async updateUnitRule(courseId: string, chapterId: number, unitId: number, rule: any) {
        return await this.learningPlanModel
            .findOneAndUpdate(
                {
                    id: courseId
                },
                { $set: { 'chapters.$[chapter].units.$[unit].rule': rule } },
                {
                    new: true,
                    upsert: true,
                    arrayFilters: [{ 'chapter.id': chapterId }, { 'unit.id': unitId }]
                }
            )
            .exec();
    }
}
