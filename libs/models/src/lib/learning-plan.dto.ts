import { NameLabelPair } from 'react-querybuilder';
import {
  IChapter,
  ILearningPlan,
  IQuestion,
  IUnit,
} from './learning-plan.interface';

export class UnitDto implements IUnit {
  constructor(public id: number, public title: string, public rule: any = {}) {}
}
export class ChapterDto implements IChapter {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public units: UnitDto[],
    public rule: any = {}
  ) {}
}

export class QuestionDto implements IQuestion {
  constructor(
    public name: string,
    public label: string,
    public valueEditorType = 'text',
    public values: NameLabelPair[],
    public operators: NameLabelPair[]
  ) {}
}

export class LearningPlanDto implements ILearningPlan {
  constructor(
    public id: string,
    public chapters: ChapterDto[],
    public questions: QuestionDto[]
  ) {}

  public static fromSchema(schemaLearningPlan: ILearningPlan) {
    return new LearningPlanDto(
      schemaLearningPlan.id,
      schemaLearningPlan.chapters.map(
        (chapter) =>
          new ChapterDto(
            chapter.id,
            chapter.title,
            chapter.description,
            chapter.units.map(
              (unit) => new UnitDto(unit.id, unit.title, unit.rule)
            )
          )
      ),
      schemaLearningPlan.questions.map(
        (question) =>
          new QuestionDto(
            question.name,
            question.label,
            question.valueEditorType,
            question.values,
            question.operators
          )
      )
    );
  }
}
