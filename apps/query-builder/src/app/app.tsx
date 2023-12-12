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
    IconButton
} from '@mui/material';
import { LearningPlanDto } from '@raise-clp/models';
import { useCallback, useEffect, useState } from 'react';
import { FieldWithType } from './components/rule-builder/RuleBuilder';

import { plainToInstance } from 'class-transformer';
import 'react-querybuilder/dist/query-builder.scss';
import './App.scss';
import ChapterOverview from './components/chapter-overview/ChapterOverview';
import RuleBuilder from './components/rule-builder/RuleBuilder';
import { SelectedItem } from './model/view.model';

const App = () => {
    const [learningPlan, setLearningPlan] = useState<LearningPlanDto>();
    const [selectedItem, setSelectedItem] = useState<SelectedItem | undefined>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [faqVisible, setFaqVisible] = useState<boolean>(false);
    const faqClasses = () => {
        let classes = 'faq';
        if (faqVisible) classes = 'faq faq--visible';
        return classes;
    };
    const handleClick = useCallback((item: SelectedItem) => {
        setSelectedItem(item);
    }, []);
    const handleDialogButtonClick = useCallback((value: boolean) => {
        setDialogOpen(value);
    }, []);

    const handleInfoButtonClick = () => {
        setFaqVisible(!faqVisible);
        document.body.style.overflow = faqVisible ? 'hidden' : 'auto';
    };

    useEffect(() => {
        console.log('selectedItem updated:', selectedItem);
    }, [selectedItem]);

    useEffect(() => {
        console.log('learningPlan updated:', learningPlan);
    }, [learningPlan]);

    const handleRefresh = useCallback(async () => {
        const learningPlanResponse = await fetch(
            `${(window as any).env.API_URL as string}/learning-plans/${learningPlan?.id}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    safety: true
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
        const lp: LearningPlanDto = await learningPlanResponse.json();
        updateSelectedItem(lp);
        setLearningPlan(lp);
    }, [learningPlan?.id]);

    const handleSave = useCallback(
        async (itemSaved: SelectedItem) => {
            if (!learningPlan?.id || !selectedItem) {
                return;
            }
            let updateUrl = `${(window as any).env.API_URL as string}/learning-plans/${
                learningPlan?.id
            }/chapters/${itemSaved.chapterId}`;
            if (itemSaved.unitId) updateUrl += `/units/${itemSaved.unitId}`;

            const learningPlanResponse = await fetch(updateUrl, {
                method: 'POST',
                body: JSON.stringify({
                    rule: itemSaved.rule
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const lp: LearningPlanDto = await learningPlanResponse.json();

            updateSelectedItem(lp);
            setLearningPlan(lp);
        },
        [learningPlan, selectedItem]
    );

    useEffect(() => {
        async function fetchLearningPlans() {
            const response = await fetch(`${(window as any).env.API_URL as string}/learning-plans`);
            const learningPlans: LearningPlanDto[] = (await response.json()) || [];

            const lp: LearningPlanDto | undefined = learningPlans.length
                ? plainToInstance(LearningPlanDto, learningPlans[learningPlans.length - 1])
                : undefined;

            let si: SelectedItem | undefined;
            if (lp?.chapters?.[0]?.units?.[0])
                si = {
                    chapterId: lp.chapters[0].id,
                    unitId: lp.chapters[0].units[0].id,
                    rule: lp.chapters[0].units[0].rule,
                    selectedDto: lp.chapters[0].units[0]
                };

            setSelectedItem(si);
            setLearningPlan(lp);
        }

        fetchLearningPlans();
    }, []);

    const updateSelectedItem = (lp: LearningPlanDto) => {
        if (!selectedItem) {
            return;
        }
        const chapter = lp.chapters.find((c) => c.id === selectedItem.chapterId);
        const unit = chapter?.units.find((u) => u.id === selectedItem.unitId);

        let si: SelectedItem | undefined;
        if (lp?.chapters?.[0]?.units?.[0])
            si = {
                ...selectedItem,
                rule: unit?.rule,
                selectedDto: unit
            };

        setSelectedItem(si);
    };

    return learningPlan ? (
        <section>
            <header>
                <div className={'header-wrapper flex-justify'}>
                    <h1>RAISE Query Builder</h1>
                    <IconButton component="label" onClick={handleInfoButtonClick}>
                        <HelpOutlineIcon />
                    </IconButton>
                </div>
            </header>
            <div className={'wrapper wrapper_grid'}>
                <div>
                    <ChapterOverview
                        learningPlan={learningPlan}
                        selected={selectedItem?.selectedDto}
                        clickHandler={handleClick}
                    />
                </div>
                <div>
                    {selectedItem ? (
                        <RuleBuilder
                            chapterId={selectedItem?.chapterId}
                            unitId={selectedItem?.unitId}
                            rule={selectedItem?.rule ?? {}}
                            fields={learningPlan?.questions as FieldWithType[]}
                            saveHandler={handleSave}
                        />
                    ) : (
                        ''
                    )}
                </div>
                <Fab
                    color="secondary"
                    aria-label="add"
                    className={'refreshbutton'}
                    onClick={() => handleDialogButtonClick(true)}
                >
                    <RefreshIcon />
                </Fab>
                <Dialog
                    open={dialogOpen}
                    onClose={() => handleDialogButtonClick(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Reload Curriculum and Questionnaire?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            If you reload the curriculum and the questionnaire rules can be corrupted and must
                            be fixed manually. Please only proceed, if you know what you are doing and are
                            comfortable with fixing possible issues afterwards!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleDialogButtonClick(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                handleDialogButtonClick(false);
                                handleRefresh();
                            }}
                            autoFocus
                        >
                            Reload
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className={faqClasses()}>
                <div className={'wrapper'}>
                    <div>
                        <div className={'flex-justify'}>
                            <h2>Docs</h2>
                            <IconButton component="label" onClick={handleInfoButtonClick}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <h3>How to use the QueryBuilder</h3>
                        <p>
                            You can see the chapters and units of the connected course on the left. You can
                            select each unit and specify rules to mark the specific unit as optional.
                        </p>
                        <p className={'hint'}>
                            The rules you define always specify under which conditions you want to make a unit{' '}
                            <strong>optional</strong>!
                        </p>
                        <h3>Build queries</h3>
                        <p>
                            In order to build queries you can combine any amount of rules. Rules can be
                            connected as <i>AND</i> or <i>OR</i>.{' '}
                        </p>
                        <p className={'hint'}>
                            <strong>Every single rule</strong> combined with <i>AND</i> must be true, so that
                            the whole rule is true!
                            <br /> <br />
                            <strong>At least one rule</strong> combined with <i>OR</i> must be true, so that
                            the whole rule is true!
                        </p>
                        <h3>Question types</h3>
                        <p>
                            The type of the question is read from paperform, so in most cases the CLP tool
                            will only allow to input values that make sense. For some types of rules, you need
                            to know some specific inputs in order to match the results. These are:
                        </p>
                        <h4>Matrix</h4>
                        <p>
                            Unfortunately paperform does not provide the options of the matrix type questions.
                            So in order to match a matrix question you need to put the indizes of the right
                            answer, separated with a comma. So for example, if the correct solution of the
                            matrix looks like this:
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
                                    <th scope="row">Response/Action = e.g. they recycle every day</th>
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
                                        Belief/Evaluation = e.g. they believe recycling is the responsible
                                        things to do
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
                            You would need to put the following into the value field (index of correct answer
                            of first row, index of correct answer second row, etc.): <i>2,1,3</i>
                        </p>
                        <h4>Rank</h4>
                        <p>
                            For the ranking the input is a bit different to the one from the matrix input. If
                            you have a some options defined in paperform, i.e.:
                        </p>
                        <div>
                            <ul>
                                <li>Option A</li>
                                <li>Option B</li>
                                <li>Option C</li>
                            </ul>
                            <div>
                                and the correct answer would be Option B, Option A, Option C. Then you would
                                need to put the correct order into the textarea and separate the options with
                                a new line. So i.e.:
                                <div className={'textarea-lookalike'}>
                                    Option B<br />
                                    Option A<br />
                                    Option C
                                </div>
                            </div>
                        </div>
                        <h4>Selection</h4>
                        <p>
                            If you want to create a rule, where a participant needs to have selected more then
                            one element of a selection type question, please create several rules, combined
                            with <i>AND</i> to choose all the possible values.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    ) : (
        <div>Loading...</div>
    );
};

export default App;
