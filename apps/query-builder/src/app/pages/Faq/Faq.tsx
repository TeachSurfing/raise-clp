import Container from '@mui/material/Container';
import './Faq.scss';

const Faq = () => {
    return (
        <div className="faq">
            <Container>
                <div className="faq__content">
                    <section>
                        <h1>Frequently Asked Questions</h1>
                    </section>
                    <section>
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
                                    <th scope="col" className="col-th">
                                        Affective component
                                    </th>
                                    <th scope="col" className="col-th">
                                        Behavorial Component
                                    </th>
                                    <th scope="col" className="col-th">
                                        Cognitive component
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" style={{ textAlign: 'left' }}>
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
                                    <th scope="row" style={{ textAlign: 'left' }}>
                                        Response/Action = e.g. they recycle every day
                                    </th>
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
                                    <th scope="row" style={{ textAlign: 'left' }}>
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
                    </section>
                </div>
            </Container>
        </div>
    );
};

export default Faq;
