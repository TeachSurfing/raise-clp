import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import './LearningPlanCard.scss';

export interface LearningPlanCardProps {
    id: string;
    name: string;
    updatedAt: string;
    description: string;
}

const LearningPlanCard = ({ id, name, updatedAt, description }: LearningPlanCardProps) => {
    const navigate: NavigateFunction = useNavigate();
    const handleClick = () => {
        navigate(`../learning-plan/${id}`);
    };
    const shortDate = format(new Date(updatedAt), 'PPP');
    const longDate = format(new Date(updatedAt), `dd.MM.yyyy 'at' HH:mm`);

    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined" className="lp-card" onClick={handleClick}>
                <CardContent>
                    <Typography
                        className="lp-card__name"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontSize: 20, margin: 0 }}
                    >
                        {name}
                    </Typography>
                    <Tooltip title={longDate}>
                        <Typography
                            sx={{ mb: 1.5, fontSize: 12, width: 'fit-content' }}
                            color="text.secondary"
                        >
                            {`Edited on ${shortDate}`}
                        </Typography>
                    </Tooltip>
                    <Typography variant="body2">{description}</Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LearningPlanCard;
