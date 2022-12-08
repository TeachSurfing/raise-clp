import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type LearningPlanDocument = HydratedDocument<LearningPlan>;

export class Unit {
  @Prop()
  @Expose()
  id: number;

  @Prop()
  @Expose()
  title: string;

  @Prop({ type: Object })
  rule: any = {};
}
export class Chapter {
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
  rule: any = {};
}
@Schema()
export class LearningPlan {
  @Prop()
  @Expose()
  id: number;

  @Prop([Chapter])
  @Type(() => Chapter)
  @Expose()
  chapters: Chapter[];

  constructor(id: number, chapters: Chapter[]) {
    this.id = id;
    this.chapters = chapters;
  }
}

export const LearningPlanSchema = SchemaFactory.createForClass(LearningPlan);
