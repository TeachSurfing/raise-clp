import { LearningPlanDto } from '@raise-clp/models';
import { plainToInstance } from 'class-transformer';
import { Component } from 'react';
import { Field, JsonLogicRulesLogic } from 'react-querybuilder';
import ChapterOverviewComponent from './components/chapter-overview/chapter-overview';
import RuleBuilderComponent from './components/rule-builder/rule-builder';

import 'react-querybuilder/dist/query-builder.scss';
import styles from './app.module.scss';

export interface SelectedItem {
  chapterId: number;
  unitId?: number;
  rule: JsonLogicRulesLogic;
}
interface ChapterOverviewState {
  learningPlan: LearningPlanDto | undefined;
  selectedItem: SelectedItem | undefined;
}

export default class AppComponent extends Component {
  state: ChapterOverviewState = {
    learningPlan: undefined,
    selectedItem: undefined,
  };

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    fetch(`${process.env['NX_API_URL']}/learning-plans`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          learningPlan: plainToInstance(LearningPlanDto, data[data.length - 1]),
        });
      });
  }

  handleClick(itemClicked: SelectedItem | undefined) {
    this.setState({ selectedItem: itemClicked });
  }

  async handleSave(itemSaved: SelectedItem) {
    let updateUrl = `${process.env['NX_API_URL']}/learning-plans/${this.state.learningPlan?.id}/chapters/${itemSaved.chapterId}`;
    if (itemSaved.unitId) updateUrl += `/units/${itemSaved.unitId}`;

    const updatedLearningPlan = await fetch(updateUrl, {
      method: 'POST',
      body: JSON.stringify({
        rule: itemSaved.rule,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());

    this.state.learningPlan = updatedLearningPlan;
  }

  render() {
    if (!this.state.learningPlan) return <div>'loading'</div>;
    return (
      <div className={styles.wrapper}>
        <div>
          <ChapterOverviewComponent
            learningPlan={this.state.learningPlan}
            clickHandler={this.handleClick}
          />
        </div>
        <div>
          {this.state.selectedItem ? (
            <RuleBuilderComponent
              chapterId={this.state.selectedItem?.chapterId}
              unitId={this.state.selectedItem?.unitId}
              rule={this.state.selectedItem?.rule ?? {}}
              fields={this.state.learningPlan.questions as Field[]}
              saveHandler={this.handleSave}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
