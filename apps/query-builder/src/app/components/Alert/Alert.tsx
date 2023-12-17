import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';

import useAppStore from '../../state/app.store';
import './Alert.scss';

export interface ClpAlertProps {
    severity: 'error' | 'warning' | 'info' | 'success';
    message: string;
    delayInSeconds?: number;
}

const ClpAlert = ({ severity, message, delayInSeconds }: ClpAlertProps) => {
    const store = useAppStore();

    useEffect(() => {
        if (!store.alert) {
            return;
        }
        const interval = setInterval(() => {
            store.setAlert(null);
            clearInterval(interval);
        }, (delayInSeconds || 5) * 1000);
        return () => clearInterval(interval);
    }, [store.alert]);

    return (
        <div id="clp-alert">
            <Box sx={{ width: '100%' }}>
                <Collapse in={!!store.alert}>
                    <Alert
                        severity={severity}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    store.setAlert(null);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                </Collapse>
            </Box>
        </div>
    );
};

export default ClpAlert;
