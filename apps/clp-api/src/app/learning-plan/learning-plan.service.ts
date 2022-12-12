import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  async findAll() {
    return await this.learningPlanModel.find().exec();
  }

  async findOne(id: string) {
    return await this.learningPlanModel.findOne({ id: id }).exec();
  }

  async addLearningPlan(data: any) {
    const newLearningPlan = await this.learningPlanService.transform(data);
    newLearningPlan.id = uuidv4();

    return await this.learningPlanModel.create(newLearningPlan);
  }

  async updateLearningPlan(id: string, url: string) {
    const newLearningPlan = await this.learningPlanService.transform(url);
    newLearningPlan.id = id;

    return await this.learningPlanModel.findOneAndUpdate(
      { id: newLearningPlan.id },
      newLearningPlan,
      {
        new: true,
        upsert: true,
      }
    );
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
        arrayFilters: [{ 'chapter.id': chapterId }],
      }
    );
  }

  async updateUnitRule(
    courseId: string,
    chapterId: number,
    unitId: number,
    rule: any
  ) {
    return await this.learningPlanModel
      .findOneAndUpdate(
        {
          id: courseId,
        },
        { $set: { 'chapters.$[chapter].units.$[unit].rule': rule } },
        {
          new: true,
          upsert: true,
          arrayFilters: [{ 'chapter.id': chapterId }, { 'unit.id': unitId }],
        }
      )
      .exec();
  }
}
