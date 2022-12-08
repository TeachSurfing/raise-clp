import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningPlan, LearningPlanDocument } from './learning-plan.schema';
import { LearningplanTransformationProvider } from './learningplan-transformation-provider.service';

@Injectable()
export class LearningPlanService {
  constructor(
    @InjectModel(LearningPlan.name)
    private learningPlanModel: Model<LearningPlanDocument>,
    private learningPlanService: LearningplanTransformationProvider
  ) {}

  async find(id: number) {
    return await this.learningPlanModel.findOne({ id: id }).exec();
  }

  async updateLearningPlan(url: string) {
    const newLearningPlan = await this.learningPlanService.transform(url);

    return await this.learningPlanModel.findOneAndUpdate(
      { id: newLearningPlan.id },
      newLearningPlan,
      {
        new: true,
        upsert: true,
      }
    );
  }

  async updateChapterRule(courseId: number, chapterId: number, rule: any) {
    return await this.learningPlanModel.findOneAndUpdate(
      { id: courseId, 'chapters.id': chapterId },
      { 'chapters.$.rule': rule },
      {
        new: true,
        upsert: true,
      }
    );
  }

  async updateUnitRule(
    courseId: number,
    chapterId: number,
    unitId: number,
    rule: any
  ) {
    return await this.learningPlanModel.findOneAndUpdate(
      {
        id: courseId,
      },
      { 'chapters.$[chapter].units.$[unit].rule': rule },
      {
        new: true,
        upsert: true,
        arrayFilters: [{ 'chapter.id': chapterId }, { 'unit.id': unitId }],
      }
    );
  }
}
