import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import { LearningPlanDto } from '@raise-clp/models';
import { useCallback, useEffect, useState } from 'react';
import { SelectedItem } from '../../model/view.model';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate, useParams } from 'react-router-dom';
import ChapterOverview from '../../components/ChapterOverview/ChapterOverview';
import RuleBuilder, { FieldWithType } from '../../components/RuleBuilder/RuleBuilder';
import { fetchLearningPlansById } from '../../services/LearningPlan.service';
import useAppStore from '../../state/app.store';
import './LearningPlan.scss';

const LearningPlan = () => {
    const store = useAppStore();
    const navigate = useNavigate();
    const urlParams = useParams();
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
        const response = await fetch(
            `${(window as any).env.API_URL as string}/learning-plans/${learningPlan?.id}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    safety: true
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
        );
        if (!response.ok) {
            handleError(response);
            return;
        }
        const lp: LearningPlanDto = await response.json();
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

            const response = await fetch(updateUrl, {
                method: 'POST',
                body: JSON.stringify({
                    rule: itemSaved.rule
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                handleError(response);
                return;
            }
            const lp: LearningPlanDto = await response.json();

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
    const goBack = (): void => {
        navigate('../learning-plans');
    };

    useEffect(() => {
        async function fetchLearningPlans() {
            let lp;
            try {
                if (!urlParams.id) {
                    goBack();
                    return;
                }
                lp = await fetchLearningPlansById(urlParams.id);
            } catch (error) {
                handleError(error as Response);
            }

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

    const handleError = async (response: Response) => {
        const json = await response.json();

        if (response.status === 401) {
            store.setAlert({
                severity: 'error',
                message: json.message
            });
            navigate('../login');
        }
        if (response.status === 404) {
            store.setAlert({
                severity: 'error',
                message: 'Learning plan not found'
            });
            goBack();
        }
    };

    return learningPlan ? (
        <>
            <section className="green-header">
                <Container>
                    <Grid container columnSpacing={0}>
                        <Grid xs={1} width={60}>
                            <Tooltip title="Back to Learning Plans">
                                <IconButton aria-label="delete" onClick={goBack}>
                                    <ArrowBackIcon style={{ color: 'white' }} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid xs={11}>
                            <Typography sx={{ mb: '8px', fontSize: 12, fontWeight: 300 }} color="white">
                                Custom Learning Plan for
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{ mb: '24px', fontSize: 24, fontWeight: 500 }}
                                color="white"
                            >
                                {learningPlan.name}
                            </Typography>
                            <Typography sx={{ mb: '24px', fontSize: 14 }} color="rgba(255, 255, 255, 0.70)">
                                {learningPlan.description}
                            </Typography>
                            <Link href={learningPlan.courseUrl} fontSize={14} underline="always">
                                {learningPlan.courseUrl}
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </section>
            <section className="query-builder">
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
                    className={'refresh-button'}
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
            </section>
        </>
    ) : (
        <div>{/* <p>Learning plan not found.</p> */}</div>
    );
};

export default LearningPlan;
