import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { LearningPlanDto } from '@raise-clp/models';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningPlanCard from '../../components/LearningPlanCard/LearningPlanCard';
import useAppStore from '../../state/app.store';
import './LearningPlans.scss';

const LearningPlans = () => {
    const store = useAppStore();
    const navigate = useNavigate();
    const [learningPlans, setLearningPlans] = useState<LearningPlanDto[]>([]);
    const handleCreateNewLearningPlan = () => {
        return;
    };

    useEffect(() => {
        async function fetchLearningPlans() {
            const response = await fetch(`${(window as any).env.API_URL as string}/learning-plans`, {
                credentials: 'include'
            });
            if (!response.ok) {
                handleError(response);
                return;
            }
            const learningPlans: LearningPlanDto[] = (await response.json()) || [];

            setLearningPlans(learningPlans);
        }

        fetchLearningPlans();
    }, []);

    const handleError = async (response: Response) => {
        const json = await response.json();
        store.setAlert({
            severity: 'error',
            message: json.message
        });
        if (response.status === 401) {
            navigate('../login');
        }
        if (response.status === 404) {
            navigate('../register');
        }
    };

    return (
        <div id="my-learning-plans">
            <section className="getting-started"></section>
            <Container maxWidth="md">
                <section className="header">
                    <div className="header__title">
                        <h1>MY LEARNING PLANS</h1>
                        <Button
                            disableElevation
                            variant="contained"
                            className="clp-button"
                            startIcon={<AddIcon />}
                            onClick={handleCreateNewLearningPlan}
                        >
                            New Learning Plan
                        </Button>
                    </div>
                    <div className="header__description">
                        <p>
                            Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et
                            velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora
                            torquent per conubia nostra, per inceptos himenaeos.
                        </p>
                    </div>
                </section>

                <hr />

                {learningPlans?.length ? (
                    <section className="lps">
                        <Grid>
                            {learningPlans.map((lp) => (
                                <Box className="lp-item">
                                    <LearningPlanCard
                                        id={lp.id}
                                        name={lp.name}
                                        updatedAt={lp.updatedAt}
                                        description={lp.description}
                                    />
                                </Box>
                            ))}
                        </Grid>
                    </section>
                ) : (
                    <section className="lps lps--empty">
                        <Grid>
                            <Box className="lps--empty__content">
                                <h3>Create your first course with Custom Learning Plan</h3>
                                <p>
                                    Sit viverra commodo a tellus. Odio non et sit lectus. Leo suspendiss sed
                                    massa, vitae faucibus aliquam aliquam. Sit pellentesque amet vulputate
                                    facilisi nibh vehicula id viverra.
                                </p>
                                <Button
                                    disableElevation
                                    variant="contained"
                                    className="clp-button"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateNewLearningPlan}
                                >
                                    New Learning Plan
                                </Button>
                            </Box>
                        </Grid>
                    </section>
                )}
            </Container>
        </div>
    );
};

export default LearningPlans;
