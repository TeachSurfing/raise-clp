import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type QuestionnaireDocument = HydratedDocument<Questionnaire>;

export class Question {
  @Prop()
  @Expose()
  name: string;

  @Prop()
  @Expose()
  label: string;

  constructor(name: string, labl: string) {
    this.name = name;
    this.label = labl;
  }
}

@Schema()
export class Questionnaire {
  @Prop()
  @Expose()
  id: string;

  @Prop([Question])
  @Type(() => Question)
  questions: Question[];

  constructor(id: string, questions: Question[]) {
    this.id = id;
    this.questions = questions;
  }
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
