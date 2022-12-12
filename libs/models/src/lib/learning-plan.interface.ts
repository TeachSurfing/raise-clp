import { NameLabelPair, RuleValidator } from 'react-querybuilder';

export interface IUnit {
  id: number;
  title: string;
  rule: any;
}
export interface IChapter {
  id: number;
  title: string;
  description: string;
  units: IUnit[];
  rule: any;
}

export interface IQuestion {
  name: string;
  label: string;
  valueEditorType: string;
  values: NameLabelPair[];
  operators: NameLabelPair[];
  defaultOperator?: string;
  defaultValue?: any;
  placeholder?: string;
  validator?: RuleValidator;
  comparator?: string;
}

export interface ILearningPlan {
  id: string;
  chapters: IChapter[];
  questions: IQuestion[];
}
