import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IChapter, ILearningPlan, IQuestion, IUnit } from '@raise-clp/models';
import { Expose, Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { NameLabelPair } from 'react-querybuilder';

export type LearningPlanDocument = HydratedDocument<LearningPlan>;

@Schema()
export class Unit implements IUnit {
  @Prop()
  @Expose()
  id: number;

  @Prop()
  @Expose()
  title: string;

  @Prop({ type: Object })
  @Expose()
  rule: any = {};

  constructor(id: number, title: string, rule = {}) {
    this.id = id;
    this.title = title;
    this.rule = rule;
  }
}

@Schema()
export class Chapter implements IChapter {
  @Prop()
  @Expose()
  id: number;

  @Prop()
  @Expose()
  title: string;

  @Prop()
  @Expose()
  description: string;

  @Prop([Unit])
  @Type(() => Unit)
  @Expose({ name: 'items' })
  units: Unit[];

  @Prop({ type: Object })
  @Expose()
  rule: any = {};

  constructor(
    id: number,
    title: string,
    description: string,
    units: Unit[],
    rule = {}
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.units = units;
    this.rule = rule;
  }
}

export class NameLabelPairImpl implements NameLabelPair {
  constructor(public name: string, public label: string) {}
}

@Schema()
export class Question implements IQuestion {
  @Prop()
  @Expose()
  name: string;

  @Prop()
  @Expose()
  label: string;

  @Prop()
  @Expose()
  inputType: string;

  @Prop()
  @Expose()
  valueEditorType: string;

  @Prop([NameLabelPairImpl])
  @Type(() => NameLabelPairImpl)
  @Expose()
  values: NameLabelPair[] | undefined;

  @Prop([NameLabelPairImpl])
  @Type(() => NameLabelPairImpl)
  @Expose()
  operators: NameLabelPair[] | undefined;

  constructor(
    name: string,
    label: string,
    inputType = 'text',
    valueEditorType = 'text',
    values?: NameLabelPair[],
    operators?: NameLabelPair[]
  ) {
    this.name = name;
    this.label = label;
    this.inputType = inputType;
    this.valueEditorType = valueEditorType;
    this.values = values;
    this.operators = operators;
  }
}

@Schema()
export class LearningPlan implements ILearningPlan {
  @Prop()
  @Expose()
  id: string;

  @Prop([Chapter])
  @Type(() => Chapter)
  @Expose()
  chapters: Chapter[];

  @Prop([Question])
  @Type(() => Question)
  questions: Question[];

  constructor(id: string, chapters: Chapter[], questions: Question[]) {
    this.id = id;
    this.chapters = chapters;
    this.questions = questions;
  }
}

export const LearningPlanSchema = SchemaFactory.createForClass(LearningPlan);
