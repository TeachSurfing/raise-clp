import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaperformSubmissionDto } from '../models/paperform-submission.dto';
import {
  Question,
  Questionnaire,
  QuestionnaireDocument,
} from './questionnaire.schema';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectModel(Questionnaire.name)
    private questionnaireModel: Model<QuestionnaireDocument>
  ) {}

  async get(id: string) {
    return await this.questionnaireModel.findOne({ id: id });
  }

  async updateQuestionnaire(data: PaperformSubmissionDto) {
    const nameLabels = this.extractNameLabel(data);

    return await this.questionnaireModel.findOneAndUpdate(
      { id: data.form_id },
      { id: data.form_id, questions: nameLabels },
      {
        new: true,
        upsert: true,
      }
    );
  }

  private extractNameLabel(submission: PaperformSubmissionDto): Question[] {
    return submission.data.map(
      (d) => new Question(d.custom_key ?? d.key, d.title)
    );
  }
}
