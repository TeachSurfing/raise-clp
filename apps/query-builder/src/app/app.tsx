import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
} from '@mui/material';
import { ChapterDto, LearningPlanDto, UnitDto } from '@raise-clp/models';
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
  selectedDto: ChapterDto | UnitDto | undefined;
  rule: JsonLogicRulesLogic;
}
interface ChapterOverviewState {
  learningPlan: LearningPlanDto | undefined;
  selectedItem: SelectedItem | undefined;
  dialogOpen: boolean;
  faqVisible: boolean;
}

export default class AppComponent extends Component {
  state: ChapterOverviewState = {
    learningPlan: undefined,
    selectedItem: undefined,
    dialogOpen: false,
    faqVisible: false,
  };

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDialogButtonClick = this.handleDialogButtonClick.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    fetch(`${(window as any).env.API_URL as string}/learning-plans`)
      .then((response) => response.json())
      .then((data: LearningPlanDto[]) => {
        const lp: LearningPlanDto = plainToInstance(
          LearningPlanDto,
          data[data.length - 1]
        );

        let selectedItem;
        if (lp.chapters?.[0]?.units?.[0])
          selectedItem = {
            chapterId: lp.chapters[0].id,
            unitId: lp.chapters[0].units[0].id,
            rule: lp.chapters[0].units[0].rule,
            selectedDto: lp.chapters[0].units[0],
          };

        this.setState({
          learningPlan: lp,
          selectedItem,
        });
      });
  }

  handleDialogButtonClick = (val: boolean) => {
    this.setState({ dialogOpen: val });
  };

  handleInfoButtonClick = () => {
    this.setState(
      { faqVisible: !this.state.faqVisible },
      () =>
        (document.body.style.overflow = this.state.faqVisible
          ? 'hidden'
          : 'auto')
    );
  };

  handleClick(itemClicked: SelectedItem | undefined) {
    this.setState({ selectedItem: itemClicked });
  }

  async handleSave(itemSaved: SelectedItem) {
    let updateUrl = `${(window as any).env.API_URL as string}/learning-plans/${
      this.state.learningPlan?.id
    }/chapters/${itemSaved.chapterId}`;
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
      `${(window as any).env.API_URL as string}/learning-plans/${
        this.state.learningPlan?.id
      }`,
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
    const faqClasses = () => {
      let classes = styles.faq;
      if (this.state.faqVisible) classes += ' ' + styles['faq--visible'];
      return classes;
    };

    if (!this.state.learningPlan) return <div>'loading'</div>;
    return (
      <section>
        <header>
          <div
            className={styles['header-wrapper'] + ' ' + styles['flex-justify']}
          >
            <h1>RAISE Query Builder</h1>
            <IconButton component="label" onClick={this.handleInfoButtonClick}>
              <HelpOutlineIcon />
            </IconButton>
          </div>
        </header>
        <div className={styles.wrapper + ' ' + styles['wrapper_grid']}>
          <div>
            <ChapterOverviewComponent
              learningPlan={this.state.learningPlan}
              selected={this.state.selectedItem?.selectedDto}
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
                corrupted and must be fixed manually. Please only proceed, if
                you know what you are doing and are comfortable with fixing
                possible issues afterwards!
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
        <div className={faqClasses()}>
          <div className={styles.wrapper}>
            <div>
              <div className={styles['flex-justify']}>
                <h2>Docs</h2>
                <IconButton
                  component="label"
                  onClick={this.handleInfoButtonClick}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <h3>How to use the QueryBuilder</h3>
              <p>
                You can see the chapters and units of the connected course on
                the left. You can select each unit and specify rules to mark the
                specific unit as optional.
              </p>
              <p className={styles.hint}>
                The rules you define always specify under which conditions you
                want to make a unit <strong>optional</strong>!
              </p>
              <h3>Build queries</h3>
              <p>
                In order to build queries you can combine any amount of rules.
                Rules can be connected as <i>AND</i> or <i>OR</i>.{' '}
              </p>
              <p className={styles.hint}>
                <strong>Every single rule</strong> combined with <i>AND</i> must
                be true, so that the whole rule is true!
                <br /> <br />
                <strong>At least one rule</strong> combined with <i>OR</i> must
                be true, so that the whole rule is true!
              </p>
              <h3>Question types</h3>
              <p>
                The type of the question is read from paperform, so in most
                cases the CLP tool will only allow to input values that make
                sense. For some types of rules, you need to know some specific
                inputs in order to match the results. These are:
              </p>
              <h4>Matrix</h4>
              <p>
                Unfortunately paperform does not provide the options of the
                matrix type questions. So in order to match a matrix question
                you need to put the indizes of the right answer, separated with
                a comma. So for example, if the correct solution of the matrix
                looks like this:
              </p>
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <th scope="col">Affective component</th>
                    <th scope="col">Behavorial Component</th>
                    <th scope="col">Cognitive component</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      Feelings/Emotions = e.g. they feel happy when they recycle
                    </th>
                    <td data-label="Affective component">
                      <input type="radio" disabled />
                    </td>
                    <td data-label="Behavorial Component">
                      <input type="radio" checked disabled />
                    </td>
                    <td data-label="Cognitive component">
                      <input type="radio" disabled />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Response/Action = e.g. they recycle every day
                    </th>
                    <td data-label="Affective component">
                      <input type="radio" checked disabled />
                    </td>
                    <td data-label="Behavorial Component">
                      <input type="radio" disabled />
                    </td>
                    <td data-label="Cognitive component">
                      <input type="radio" disabled />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Belief/Evaluation = e.g. they believe recycling is the
                      responsible things to do
                    </th>
                    <td data-label="Affective component">
                      <input type="radio" disabled />
                    </td>
                    <td data-label="Behavorial Component">
                      <input type="radio" disabled />
                    </td>
                    <td data-label="Cognitive component">
                      <input type="radio" checked disabled />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>
                You would need to put the following into the value field (index
                of correct answer of first row, index of correct answer second
                row, etc.): <i>2,1,3</i>
              </p>
              <h4>Ranking</h4>
              <p>
                For the ranking the input is similiar to the matrix. If you have
                a some options defined in paperform, i.e.:
              </p>
              <ul>
                <li> Option A</li>
                <li> Option B</li>
                <li> Option C</li>
              </ul>
              <p>
                and the correct answer would be B, C, A. Then you would need to
                put <i>2,3,1</i> into the value field.
              </p>
              <h4>Selection</h4>
              <p>
                If you want to create a rule, where a participant needs to have
                selected more then one element of a selection type question,
                please create several rules, combined with <i>AND</i> to choose
                all the possible values.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
