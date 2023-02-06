import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { FieldValueType } from '@raise-clp/models';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { Component } from 'react';
import {
  DefaultRuleGroupType,
  Field,
  formatQuery,
  JsonLogicRulesLogic,
  parseJsonLogic,
  QueryBuilder,
  RuleValidator,
  ValidationResult,
} from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.scss';
import { SelectedItem } from '../../app';
import './rule-builder.scss';

interface RuleBuilderState {
  rule: DefaultRuleGroupType;
  chapterId: number | undefined;
  unitId: number | undefined;
  fields: Field[] | undefined;
}

export interface FieldWithType extends Field {
  questionType: FieldValueType;
}

interface RuleBuilderProps {
  chapterId: number | undefined;
  unitId: number | undefined;
  rule: JsonLogicRulesLogic;
  fields: FieldWithType[] | undefined;

  saveHandler: (selectedItem: SelectedItem) => void;
}

export const validatorFactory = (field: any) => {
  switch (field.fieldType) {
    case FieldValueType.boolean:
      return yesNoValidator;
    case FieldValueType.number:
      return numberValidator;
    default:
      return defaultValidator;
  }
};

export const defaultValidator: RuleValidator = (rule): ValidationResult => {
  return {
    valid:
      rule.value !== undefined &&
      rule.value !== null &&
      typeof rule.value == 'string',
    reasons: ['Field has no value'],
  };
};

export const numberValidator: RuleValidator = (rule): ValidationResult => {
  return {
    valid:
      rule.value !== undefined &&
      rule.value !== null &&
      typeof rule.value == 'number',
    reasons: ['Field has no value'],
  };
};

export const yesNoValidator: RuleValidator = (rule): ValidationResult => {
  return {
    valid:
      rule.value !== undefined &&
      rule.value !== null &&
      typeof rule.value == 'boolean',
    reasons: ['Field value has invalid type'],
  };
};

export const addValidators = (fields: Field[] | undefined) => {
  fields = fields?.map((field) => ({
    ...field,
    validator: validatorFactory(field),
  }));

  return fields;
};

export default class RuleBuilderComponent extends Component<RuleBuilderProps> {
  public readonly state: RuleBuilderState = {
    chapterId: this.props.chapterId,
    unitId: this.props.unitId,
    rule: parseJsonLogic(this.props.rule ?? {}),
    fields: addValidators(this.props.fields),
  };

  constructor(props: any) {
    super(props);

    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  static getDerivedStateFromProps(
    props: RuleBuilderProps,
    state: RuleBuilderState
  ) {
    if (props.chapterId !== state.chapterId || props.unitId !== state.unitId)
      return {
        rule: parseJsonLogic(props.rule),
        chapterId: props.chapterId,
        unitId: props.unitId,
        fields: addValidators(props.fields),
      };

    return null;
  }

  async handleQueryChange(change: any) {
    this.setState({ rule: change });
    const rule = formatQuery(change, 'jsonlogic') || {};

    if (!this.state?.chapterId) return;

    this.props.saveHandler({
      chapterId: this.state.chapterId,
      unitId: this.state.unitId,
      selectedDto: undefined,
      rule: rule,
    });
  }

  render() {
    if (this.state.fields)
      return (
        <section className="wrapper">
          <h2>Build your Query</h2>
          <QueryBuilderDnD>
            <QueryBuilderMaterial>
              <QueryBuilder
                key={`${this.state.chapterId}_${this.state.unitId ?? 0}`}
                fields={this.state.fields}
                query={this.state.rule}
                onQueryChange={this.handleQueryChange}
              />
            </QueryBuilderMaterial>
          </QueryBuilderDnD>

          <Accordion className="logic">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              JSON logic (<i>for development purposes only</i>)
            </AccordionSummary>
            <AccordionDetails>
              <code>
                <pre>
                  {JSON.stringify(
                    formatQuery(this.state.rule, 'jsonlogic'),
                    null,
                    2
                  )}
                </pre>
              </code>
            </AccordionDetails>
          </Accordion>
        </section>
      );
    else return 'loading ...';
  }
}
