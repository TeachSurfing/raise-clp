import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import { LearningPlanDto } from '@raise-clp/models';
import { plainToInstance } from 'class-transformer';
import { useCallback, useEffect, useState } from 'react';
import { SelectedItem } from '../../model/view.model';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import ChapterOverview from '../ChapterOverview/ChapterOverview';
import RuleBuilder, { FieldWithType } from '../RuleBuilder/RuleBuilder';
import './Home.scss';

const Home = () => {
    const [learningPlan, setLearningPlan] = useState<LearningPlanDto>();
    const [selectedItem, setSelectedItem] = useState<SelectedItem | undefined>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const handleClick = useCallback((item: SelectedItem) => {
        setSelectedItem(item);
    }, []);
    const handleDialogButtonClick = useCallback((value: boolean) => {
        setDialogOpen(value);
    }, []);
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

    // TODO: Remove this:
    useEffect(() => {
        console.log('selectedItem updated:', selectedItem);
    }, [selectedItem]);

    useEffect(() => {
        console.log('learningPlan updated:', learningPlan);
    }, [learningPlan]);

    return learningPlan ? (
        <div>
            <Container>
                <Grid container columnSpacing={2}>
                    <Grid sm={12} md={3}>
                        <ChapterOverview
                            learningPlan={learningPlan}
                            selected={selectedItem?.selectedDto}
                            clickHandler={handleClick}
                        />
                    </Grid>
                    <Grid sm={12} md={9}>
                        <RuleBuilder
                            chapterId={selectedItem?.chapterId}
                            unitId={selectedItem?.unitId}
                            rule={selectedItem?.rule ?? {}}
                            fields={learningPlan?.questions as FieldWithType[]}
                            saveHandler={handleSave}
                        />
                    </Grid>
                </Grid>
            </Container>

            <Fab
                color="primary"
                aria-label="add"
                className={'refreshbutton'}
                sx={{ color: 'white' }}
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
                        If you reload the curriculum and the questionnaire rules can be corrupted and must be
                        fixed manually. Please only proceed, if you know what you are doing and are
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
    ) : (
        <div>{/* <p>Learning plan not found.</p> */}</div>
    );
};

export default Home;
