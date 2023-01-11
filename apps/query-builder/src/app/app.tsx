import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from '@mui/material';
import { LearningPlanDto } from '@raise-clp/models';
import { plainToInstance } from 'class-transformer';
import { Component } from 'react';
import { JsonLogicRulesLogic } from 'react-querybuilder';
import ChapterOverviewComponent from './components/chapter-overview/chapter-overview';
import RuleBuilderComponent, {
  FieldWithType,
} from './components/rule-builder/rule-builder';

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
  dialogOpen: boolean;
}

export default class AppComponent extends Component {
  state: ChapterOverviewState = {
    learningPlan: undefined,
    selectedItem: undefined,
    dialogOpen: false,
  };

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDialogButtonClick = this.handleDialogButtonClick.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
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

  handleDialogButtonClick = (val: boolean) => {
    this.setState({ dialogOpen: val });
  };

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

  async handleRefresh() {
    const updatedLearningPlan = await fetch(
      `${process.env['NX_API_URL']}/learning-plans/${this.state.learningPlan?.id}`,
      {
        method: 'POST',
        body: JSON.stringify({
          safety: true,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => response.json());

    this.setState({ learningPlan: updatedLearningPlan });
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
              fields={this.state.learningPlan.questions as FieldWithType[]}
              saveHandler={this.handleSave}
            />
          ) : (
            ''
          )}
        </div>
        <Fab
          color="secondary"
          aria-label="add"
          className={styles.refreshbutton}
          onClick={() => this.handleDialogButtonClick(true)}
        >
          <RefreshIcon />
        </Fab>
        <Dialog
          open={this.state.dialogOpen}
          onClose={() => this.handleDialogButtonClick(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Reload Curriculum and Questionnaire?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you reload the curriculum and the questionnaire rules can be
              corrupted and must be fixed manually. Please only proceed, if you
              know what you are doing and are comfortable with fixing possible
              issues afterwards!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDialogButtonClick(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.handleDialogButtonClick(false);
                this.handleRefresh();
              }}
              autoFocus
            >
              Reload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
