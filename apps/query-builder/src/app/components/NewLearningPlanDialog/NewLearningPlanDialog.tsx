import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { BaseLearningPlan } from '../../model/base-learning-plan.model';
import './NewLearningPlanDialog.scss';

type NewLearningPlanDialogProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (values: BaseLearningPlan, helpers: FormikHelpers<BaseLearningPlan>) => void;
    onCancel: () => void;
};

const NewLearningPlanDialog = ({
    isOpen,
    title,
    onClose,
    onSubmit,
    onCancel
}: NewLearningPlanDialogProps) => {
    const handleValidate = ({ name, courseUrl, questionnaireUrl, paperformToken }: BaseLearningPlan) => {
        const errors = {} as BaseLearningPlan;
        if (!name) errors.name = 'Course name is required';
        if (!courseUrl) errors.courseUrl = 'Course URL is required';
        if (!questionnaireUrl) errors.questionnaireUrl = 'Paperform URL is required';
        if (!paperformToken) errors.paperformToken = 'Paperform Token is required';
        return errors;
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} maxWidth="xs">
                <DialogTitle>{title}</DialogTitle>

                <DialogContent>
                    <DialogContentText fontSize={14}>
                        Please provide the name of the course you’re creating the learning plan for. You can
                        enter all optional information later.
                    </DialogContentText>

                    <div className="new-lp-form">
                        <Formik
                            initialValues={{
                                name: '',
                                description: '',
                                courseUrl: '',
                                paperformToken: '',
                                questionnaireUrl: ''
                            }}
                            validate={handleValidate}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="login__form-wrapper__form">
                                    <br />

                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="name"
                                        label="Course name"
                                    />
                                    <br />
                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="description"
                                        label="Description (optional)"
                                    />
                                    <br />
                                    <Field
                                        component={TextField}
                                        type="url"
                                        name="courseUrl"
                                        label="URL to course"
                                    />
                                    <br />
                                    <DialogContentText fontSize={14}>
                                        Please provide connect your Paperform evaluation survey and the token
                                        needed to access it.
                                    </DialogContentText>
                                    <br />
                                    <Field
                                        component={TextField}
                                        type="url"
                                        name="questionnaireUrl"
                                        label="Paperform URL"
                                    />
                                    <br />

                                    <Field
                                        component="textarea"
                                        type="text"
                                        rows="6"
                                        name="paperformToken"
                                        label="Paperform Token"
                                        className="resize-none"
                                        required
                                    />
                                    <br />
                                    <DialogActions>
                                        <Button color="error" onClick={onCancel}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="clp-simple-button"
                                            disabled={isSubmitting}
                                        >
                                            Create
                                        </Button>
                                    </DialogActions>
                                    {isSubmitting && <LinearProgress />}
                                </Form>
                            )}
                        </Formik>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewLearningPlanDialog;
