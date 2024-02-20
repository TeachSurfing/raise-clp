import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import TaskIcon from '@mui/icons-material/Task';
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
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate, useParams } from 'react-router-dom';
import ChapterOverview from '../../components/ChapterOverview/ChapterOverview';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import RuleBuilder, { FieldWithType } from '../../components/RuleBuilder/RuleBuilder';
import { deleteLearningPlan, fetchLearningPlanById } from '../../services/LearningPlan.service';
import useAppStore from '../../state/app.store';
import './LearningPlan.scss';

const LearningPlan = () => {
    const store = useAppStore();
    const navigate = useNavigate();
    const urlParams = useParams();
    const [learningPlan, setLearningPlan] = useState<LearningPlanDto>();
    const [selectedItem, setSelectedItem] = useState<SelectedItem | undefined>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [fromClick, setFromClick] = useState<boolean>(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

    const onUnitClicked = useCallback((item: SelectedItem) => {
        setFromClick(true);
        setSelectedItem(item);
    }, []);
    const handleDialogButtonClick = useCallback((value: boolean) => {
        setDialogOpen(value);
    }, []);
    const handleDeleteClick = useCallback((value: boolean) => {
        setConfirmDialogOpen(value);
    }, []);
    const handleDelete = async () => {
        if (!learningPlan?.id) {
            return;
        }
        try {
            await deleteLearningPlan(learningPlan.id);
        } catch (err) {
            console.error(err);
            store.setAlert({
                severity: 'error',
                message: 'An error occurred while deleting learning plan '
            });
        }

        goBack();
        store.setAlert({
            severity: 'success',
            message: 'Learning plan has been successfully deleted.'
        });
    };
    const handleRefresh = async () => {
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
    };

    const handleSave = useCallback(
        async (itemSaved: SelectedItem, shouldSkip: boolean) => {
            if (fromClick || shouldSkip || !learningPlan?.id || !selectedItem?.chapterId) {
                setFromClick(false);
                return;
            }
            // const lpRule = learningPlan.chapters
            //     .find(_propEq('id', selectedItem.chapterId))
            //     ?.units.find(_propEq('id', selectedItem.unitId))?.rule;
            // if (_isEqual(lpRule, selectedItem?.rule)) {
            //     return;
            // }
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
        [learningPlan, selectedItem, fromClick]
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
                lp = await fetchLearningPlanById(urlParams.id);
            } catch (error) {
                handleError(error as Response);
            }

            let si: SelectedItem | undefined;
            if (lp?.chapters?.[0]?.units?.[0]) {
                const firstChapter = lp?.chapters[0];
                const firstUnit = lp?.chapters[0].units[0];
                si = {
                    chapterId: firstChapter.id,
                    unitId: firstUnit.id,
                    rule: firstUnit.rule,
                    selectedDto: firstUnit
                };
            }

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
                            <Grid container>
                                <Grid xs={9}>
                                    <Typography
                                        sx={{ mb: '8px', fontSize: 12, fontWeight: 300 }}
                                        color="white"
                                    >
                                        Custom Learning Plan for
                                    </Typography>
                                    <Typography
                                        variant="h1"
                                        sx={{ mb: '24px', fontSize: 24, fontWeight: 500 }}
                                        color="white"
                                    >
                                        {learningPlan.name}
                                    </Typography>
                                </Grid>
                                <Grid xs={3} className="toolbar">
                                    <Button
                                        variant="outlined"
                                        className="clp-button clp-button--outlined"
                                        startIcon={<CreateOutlinedIcon />}
                                        disabled
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className="clp-button clp-button--outlined"
                                        startIcon={<DeleteOutlineOutlinedIcon />}
                                        onClick={() => handleDeleteClick(true)}
                                    >
                                        Delete
                                    </Button>
                                </Grid>
                            </Grid>

                            <Typography sx={{ mb: '24px', fontSize: 14 }} color="rgba(255, 255, 255, 0.70)">
                                {learningPlan.description}
                            </Typography>
                            <div>
                                <Link
                                    href={learningPlan.courseUrl}
                                    fontSize={14}
                                    className="link-wrapper"
                                    underline="always"
                                >
                                    <AutoStoriesIcon
                                        className="link-icon"
                                        sx={{ fontSize: 20 }}
                                        color="primary"
                                    />
                                    {learningPlan.courseUrl}
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={learningPlan.questionnaireUrl}
                                    fontSize={14}
                                    className="link-wrapper"
                                    underline="always"
                                >
                                    <TaskIcon className="link-icon" sx={{ fontSize: 20 }} color="primary" />
                                    {learningPlan.questionnaireUrl}
                                </Link>
                            </div>
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
                                clickHandler={onUnitClicked}
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
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                title={'Delete Learning Plan'}
                message={'Are you sure, you want to remove this learning plan?'}
                confirmText={'Remove'}
                confirmColor={'error'}
                cancelText={'Cancel'}
                onClose={() => handleDeleteClick(false)}
                onConfirm={handleDelete}
                onCancel={() => handleDeleteClick(false)}
            />
        </>
    ) : (
        <div>{/* <p>Learning plan not found.</p> */}</div>
    );
};

export default LearningPlan;
