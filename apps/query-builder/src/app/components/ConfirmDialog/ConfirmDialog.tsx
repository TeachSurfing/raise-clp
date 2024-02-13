import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './ConfirmDialog.scss';

type ConfirmDialogProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'success';
    cancelText: string;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmText,
    confirmColor,
    cancelText,
    onClose,
    onConfirm,
    onCancel
}: ConfirmDialogProps) => {
    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>{cancelText}</Button>
                    <Button onClick={onConfirm} color={confirmColor || 'primary'} autoFocus>
                        {confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConfirmDialog;
