import { createTheme, ThemeProvider } from '@mui/material';
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

const muiTheme = createTheme();

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
    rule: parseJsonLogic(this.props.rule),
    fields: this.props.fields,
  };

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

  async save() {
    if (!this.state.chapterId) return;

    this.props.saveHandler({
      chapterId: this.state.chapterId,
      unitId: this.state.unitId,
      rule: formatQuery(this.state.rule, 'jsonlogic'),
    });
  }

  render() {
    if (this.state.fields)
      return (
        <section className="wrapper">
          <h1>Build your Query</h1>
          <QueryBuilderDnD>
            <ThemeProvider theme={muiTheme}>
              <QueryBuilderMaterial>
                <QueryBuilder
                  key={`${this.state.chapterId}_${this.state.unitId ?? 0}`}
                  fields={this.state.fields}
                  query={this.state.rule}
                  onQueryChange={(changed) => this.setState({ rule: changed })}
                />
              </QueryBuilderMaterial>
            </ThemeProvider>
          </QueryBuilderDnD>
          <button onClick={() => this.save()}>Save</button>
          <h4>
            JSON logic as result of <code>formatQuery(query, 'jsonlogic')</code>
            :
          </h4>
          <pre>{JSON.stringify(formatQuery(this.state.rule, 'jsonlogic'))}</pre>
        </section>
      );
    else return 'loading ...';
  }
}
