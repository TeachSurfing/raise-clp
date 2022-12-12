// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
// import {
//   PaperFormQuestionType,
//   PaperformSubmissionDto,
// } from '../models/paperform-submission.dto';
// import {
//   Question,
//   Questionnaire,
//   QuestionnaireDocument,
// } from './questionnaire.schema';

// @Injectable()
// export class QuestionnaireService {
//   constructor(
//     @InjectModel(Questionnaire.name)
//     private questionnaireModel: Model<QuestionnaireDocument>
//   ) {}

//   async getAll() {
//     return await this.questionnaireModel.find();
//   }

//   async get(id: string) {
//     return await this.questionnaireModel.findOne({ id: id });
//   }

//   async addQuestionnaire(data: PaperformSubmissionDto) {
//     const nameLabels = this.extractNameLabel(data);

//     const id = uuidv4();

//     return await this.questionnaireModel.create({
//       id: id,
//       questions: nameLabels,
//     });
//   }

//   async updateQuestionnaire(id: string, data: PaperformSubmissionDto) {
//     const nameLabels = this.extractNameLabel(data);

//     ('https//api.paperform.co/v1/forms/upfrontquestionnaire/fields');

//     return await this.questionnaireModel.findOneAndUpdate(
//       { id: id },
//       { id: id, questions: nameLabels },
//       {
//         upsert: true,
//       }
//     );
//   }

//   private extractNameLabel(submission: PaperformSubmissionDto): Question[] {
//     return submission.data.map(
//       (d) =>
//         new Question(d.custom_key ?? d.key, d.title, this.deriveType(d.type))
//     );
//   }

//   private deriveType(paperFormType: PaperFormQuestionType) {
//     switch (paperFormType) {
//       case PaperFormQuestionType.address:
//         return 'text';
//       case PaperFormQuestionType.appointment:
//         return 'date';
//       case PaperFormQuestionType.calculations:
//         return 'text';
//       case PaperFormQuestionType.choices:
//         return 'text';
//       case PaperFormQuestionType.color:
//         return 'text';
//       case PaperFormQuestionType.country:
//         return 'text';
//       case PaperFormQuestionType.date:
//         return 'date';
//       case PaperFormQuestionType.dropdown:
//         return 'select';
//       case PaperFormQuestionType.email:
//         return 'text';
//       case PaperFormQuestionType.file:
//         return 'text';
//       case PaperFormQuestionType.hidden:
//         return 'text';
//       case PaperFormQuestionType.image:
//         return 'text';
//       case PaperFormQuestionType.matrix:
//         return 'text';
//       case PaperFormQuestionType.number:
//         return 'text';
//       case PaperFormQuestionType.phone:
//         return 'text';
//       case PaperFormQuestionType.price:
//         return 'text';
//       case PaperFormQuestionType.products:
//         return 'text';
//       case PaperFormQuestionType.rank:
//         return 'text';
//       case PaperFormQuestionType.rating:
//         return 'text';
//       case PaperFormQuestionType.scale:
//         return 'text';
//       case PaperFormQuestionType.signature:
//         return 'text';
//       case PaperFormQuestionType.slider:
//         return 'text';
//       case PaperFormQuestionType.text:
//         return 'text';
//       case PaperFormQuestionType.time:
//         return 'time';
//       case PaperFormQuestionType.url:
//         return 'text';
//       case PaperFormQuestionType.yesNo:
//         return 'radio';
//       default:
//       // return assertUnreachable(paperFormType);
//     }
//   }
// }
