import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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

interface RuleBuilderProps {
  chapterId: number | undefined;
  unitId: number | undefined;
  rule: JsonLogicRulesLogic;
  fields: Field[] | undefined;

  saveHandler: (selectedItem: SelectedItem) => void;
}

export default class RuleBuilderComponent extends Component<RuleBuilderProps> {
  public readonly state: RuleBuilderState = {
    chapterId: this.props.chapterId,
    unitId: this.props.unitId,
    rule: parseJsonLogic(this.props.rule ?? {}),
    fields: this.props.fields,
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
      };

    return null;
  }

  async handleQueryChange(change: any) {
    this.setState({ rule: change });
    const rule = formatQuery(change, 'jsonlogic');

    if (!this.state?.chapterId || !rule) return;

    this.props.saveHandler({
      chapterId: this.state.chapterId,
      unitId: this.state.unitId,
      rule: formatQuery(change, 'jsonlogic'),
    });
  }

  render() {
    if (this.state.fields)
      return (
        <section className="wrapper">
          <h1>Build your Query</h1>
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
