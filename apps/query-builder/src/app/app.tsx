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
    this.setState({ faqVisible: !this.state.faqVisible });
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
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Mollitia accusamus, et adipisci aut illo animi? Fuga culpa
                perferendis inventore laborum aliquid. Illum consectetur,
                inventore minima reprehenderit quaerat quia eos fugit?
              </p>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Mollitia accusamus, et adipisci aut illo animi? Fuga culpa
                perferendis inventore laborum aliquid. Illum consectetur,
                inventore minima reprehenderit quaerat quia eos fugit?
              </p>
              <h3>How to use the QueryBuilder</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Mollitia accusamus, et adipisci aut illo animi? Fuga culpa
                perferendis inventore laborum aliquid. Illum consectetur,
                inventore minima reprehenderit quaerat quia eos fugit?
              </p>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Mollitia accusamus, et adipisci aut illo animi? Fuga culpa
                perferendis inventore laborum aliquid. Illum consectetur,
                inventore minima reprehenderit quaerat quia eos fugit?
              </p>
              <h3>How to use the QueryBuilder</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Mollitia accusamus, et adipisci aut illo animi? Fuga culpa
                perferendis inventore laborum aliquid. Illum consectetur,
                inventore minima reprehenderit quaerat quia eos fugit?
              </p>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Mollitia accusamus, et adipisci aut illo animi? Fuga culpa
                perferendis inventore laborum aliquid. Illum consectetur,
                inventore minima reprehenderit quaerat quia eos fugit?
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
