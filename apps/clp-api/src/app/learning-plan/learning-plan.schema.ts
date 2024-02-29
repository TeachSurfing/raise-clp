import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IChapter, ILearningPlan, IQuestion, IUnit } from '@raise-clp/models';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
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

    constructor(id: number, title: string, description: string, units: Unit[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.units = units;
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
    questionType: string;

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
        questionType: string,
        inputType = 'text',
        valueEditorType = 'text',
        values?: NameLabelPair[],
        operators?: NameLabelPair[]
    ) {
        this.name = name;
        this.label = label;
        this.questionType = questionType;
        this.inputType = inputType;
        this.valueEditorType = valueEditorType;
        this.values = values;
        this.operators = operators;
    }
}

export class NewLearningPlanDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    courseUrl: string;

    @IsNotEmpty()
    @IsUrl()
    lpOptionalUrl: string;

    @IsNotEmpty()
    @IsUrl()
    questionnaireUrl: string;

    @IsNotEmpty()
    @IsString()
    paperformToken: string;
}

@Schema({ versionKey: false, timestamps: true })
export class LearningPlan implements ILearningPlan {
    @Prop()
    @Expose()
    id: string;

    @Prop()
    @Expose()
    name: string;

    @Prop()
    @Expose()
    description: string;

    @Prop([Chapter])
    @Type(() => Chapter)
    @Expose()
    chapters: Chapter[];

    @Prop([Question])
    @Type(() => Question)
    questions: Question[];

    @Prop()
    @Expose()
    courseUrl: string;

    @Prop()
    @Expose()
    lpOptionalUrl: string;

    @Prop()
    @Expose()
    questionnaireUrl: string;

    @Prop()
    @Expose()
    paperformToken: string;

    @Prop()
    userId: string;

    @Prop()
    createdAt: string;

    @Prop()
    updatedAt: string;

    constructor(
        id: string,
        name: string,
        description: string,
        chapters: Chapter[],
        questions: Question[],
        courseUrl: string,
        lpOptionalUrl: string,
        questionnaireUrl: string,
        paperformToken: string,
        userId: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.chapters = chapters;
        this.questions = questions;
        this.courseUrl = courseUrl;
        this.lpOptionalUrl = lpOptionalUrl;
        this.questionnaireUrl = questionnaireUrl;
        this.paperformToken = paperformToken;
        this.userId = userId;
    }
}

export const LearningPlanSchema = SchemaFactory.createForClass(LearningPlan);
