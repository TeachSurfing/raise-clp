import { plainToInstance } from 'class-transformer';
import { Component } from 'react';
import { Field, JsonLogicRulesLogic } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.scss';
import styles from './app.module.scss';
import ChapterOverviewComponent from './components/chapter-overview/chapter-overview';
import RuleBuilderComponent from './components/rule-builder/rule-builder';
import { LearningPlan } from './models/learning-plan.model';

export interface SelectedItem {
  chapterId: number;
  unitId?: number;
  rule: JsonLogicRulesLogic;
}
interface ChapterOverviewState {
  learningPlan: LearningPlan | undefined;
  selectedItem: SelectedItem | undefined;
  fields: Field[] | undefined;
}

export default class AppComponent extends Component {
  state: ChapterOverviewState = {
    learningPlan: undefined,
    selectedItem: undefined,
    fields: undefined,
  };

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    fetch(`${process.env['NX_API_URL']}/learning-plan/18045`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ learningPlan: plainToInstance(LearningPlan, data) });
      });

    fetch(`${process.env['NX_API_URL']}/questionnaire/638e3a89cd0931db0305978b`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ fields: data.questions });
      });
  }

  handleClick(itemClicked: SelectedItem | undefined) {
    this.setState({ selectedItem: itemClicked });
  }

  async handleSave(itemSaved: SelectedItem) {
    const updatedLearningPlan = await fetch(
      `${process.env['NX_API_URL']}/learning-plan/18045`,
      {
        method: 'POST',
        body: JSON.stringify({
          chapterId: itemSaved.chapterId,
          unitId: itemSaved.unitId,
          rule: itemSaved.rule,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => response.json());

    this.state.learningPlan = updatedLearningPlan;
  }

  render() {
    if (!(this.state.learningPlan || this.state.fields))
      return <div>'loading'</div>;
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
              rule={this.state.selectedItem?.rule}
              fields={this.state.fields}
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
