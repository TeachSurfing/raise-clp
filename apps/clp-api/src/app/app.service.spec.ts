import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { LearningPlan } from './learning-plan/learning-plan.schema';
import { LearningPlanService } from './learning-plan/learning-plan.service';
import { LearningplanTransformationProvider } from './learning-plan/learningplan-transformation-provider.service';
import { LearnpressTransformationProvider } from './learning-plan/learnpress-transformation-provider.service';
import { MailService } from './mail/mail.service';
import { Data, PaperformSubmissionDto } from './models/paperform-submission.dto';
import { Submission } from './submission/submission.schema';

describe('TestService', () => {
    let service: AppService;

    beforeEach(async () => {
        const submissionModelMock = new Submission(undefined, undefined);
        const learningPlanModelMock = new LearningPlan(
            '66ace02b-7c51-43ed-9986-1d24cb0709ef',
            [
                {
                    id: 1,
                    title: 'Chapter A',
                    description: '',
                    units: [
                        {
                            id: 0,
                            title: 'Unit A.1',
                            rule: {
                                '>=': [
                                    {
                                        var: 'rating'
                                    },
                                    '4'
                                ]
                            }
                        },
                        {
                            id: 1,
                            title: 'Unit A.2',
                            rule: {
                                '==': [
                                    {
                                        var: 'matrix'
                                    },
                                    '2,1,3'
                                ]
                            }
                        },
                        {
                            id: 2,
                            title: 'Unit A.3',
                            rule: {
                                '==': [
                                    {
                                        var: 'boolean'
                                    },
                                    'Yes'
                                ]
                            }
                        },
                        {
                            id: 3,
                            title: 'Unit A.4',
                            rule: {
                                in: [
                                    'Exists',
                                    {
                                        var: 'multiple_choice'
                                    }
                                ]
                            }
                        },
                        {
                            id: 4,
                            title: 'Unit A.5',
                            rule: {
                                '==': [
                                    {
                                        var: 'dropdown'
                                    },
                                    'Selected'
                                ]
                            }
                        },
                        {
                            id: 5,
                            title: 'Unit A.6',
                            rule: {
                                '==': [
                                    {
                                        var: 'rank'
                                    },
                                    'B\nA\nC'
                                ]
                            }
                        }
                    ]
                }
            ],
            [
                {
                    name: 'email',
                    label: 'Email Hidden',
                    questionType: 'string',
                    inputType: 'text',
                    valueEditorType: 'text',
                    values: [],
                    operators: [
                        {
                            name: '=',
                            label: '='
                        },
                        {
                            name: '!=',
                            label: '!='
                        },
                        {
                            name: '<',
                            label: '<'
                        },
                        {
                            name: '>',
                            label: '>'
                        },
                        {
                            name: '<=',
                            label: '<='
                        },
                        {
                            name: '>=',
                            label: '>='
                        },
                        {
                            name: 'contains',
                            label: 'contains'
                        },
                        {
                            name: 'beginsWith',
                            label: 'begins with'
                        },
                        {
                            name: 'endsWith',
                            label: 'ends with'
                        },
                        {
                            name: 'doesNotContain',
                            label: 'does not contain'
                        },
                        {
                            name: 'doesNotBeginWith',
                            label: 'does not begin with'
                        },
                        {
                            name: 'doesNotEndWith',
                            label: 'does not end with'
                        },
                        {
                            name: 'null',
                            label: 'is null'
                        },
                        {
                            name: 'notNull',
                            label: 'is not null'
                        },
                        {
                            name: 'in',
                            label: 'in'
                        },
                        {
                            name: 'notIn',
                            label: 'not in'
                        },
                        {
                            name: 'between',
                            label: 'between'
                        },
                        {
                            name: 'notBetween',
                            label: 'not between'
                        }
                    ]
                }
            ],
            '',
            '',
            ''
        );

        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [
                AppService,
                ConfigService,
                LearningPlanService,
                {
                    provide: LearningPlanService,
                    useValue: {
                        findLatest: jest.fn().mockResolvedValue({ toObject: () => learningPlanModelMock })
                    }
                },
                {
                    provide: getModelToken(Submission.name),
                    useValue: submissionModelMock
                },
                {
                    provide: getModelToken(LearningPlan.name),
                    useValue: learningPlanModelMock
                },
                {
                    provide: LearningplanTransformationProvider,
                    useClass: LearnpressTransformationProvider
                },
                {
                    provide: MailService,
                    useValue: () => {
                        return true;
                    }
                }
            ]
        }).compile();

        service = module.get<AppService>(AppService);
    });

    const createSubmission = (dataTrue: Data, dataFalse: Data) => {
        const toBeTrue = new PaperformSubmissionDto();
        toBeTrue.data = [dataTrue];
        const toBeFalse = new PaperformSubmissionDto();
        toBeFalse.data = [dataFalse];

        return { toBeTrue, toBeFalse };
    };

    const createNormalizedData = (data: {
        toBeTrue: PaperformSubmissionDto;
        toBeFalse: PaperformSubmissionDto;
    }) => {
        const toBeTrue = service.normalizeData(data.toBeTrue);
        const toBeFalse = service.normalizeData(data.toBeFalse);

        return { toBeTrue, toBeFalse };
    };

    const evaluateRules = async (data: { toBeTrue: unknown; toBeFalse: unknown }) => {
        const toBeTrue = await service.evaluateRules(data.toBeTrue);
        const toBeFalse = await service.evaluateRules(data.toBeFalse);

        return { toBeTrue, toBeFalse };
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should transform and evaluate a simple score rule', async () => {
        expect(true).toBe(true);

        const dataTrue = {
            title: 'Rating 5',
            type: 'rating',
            key: 'rating',
            custom_key: null,
            value: 5
        } as Data;

        const dataFalse = {
            title: 'Rating',
            type: 'rating',
            key: 'rating',
            custom_key: null,
            value: 1
        } as Data;

        const submissions = createSubmission(dataTrue, dataFalse);
        const normalizedData = createNormalizedData(submissions);

        expect(normalizedData.toBeTrue).toEqual({ [dataTrue.key]: dataTrue.value });
        expect(normalizedData.toBeFalse).toEqual({
            [dataFalse.key]: dataFalse.value
        });

        const clps = await evaluateRules(normalizedData);

        expect(clps.toBeTrue.chapters[0].recommendation).toBe(true);
        expect(clps.toBeFalse.chapters[0].recommendation).toBe(false);
    });

    it('should transform and evaluate a matrix rule', async () => {
        const dataTrue = {
            title: 'Matrix',
            description: null,
            type: 'matrix',
            key: 'matrix',
            custom_key: null,
            value: [
                ['Col 1', 'Col 2', 'Col 3', 'Col 4'],
                ['Row 1', 2],
                ['Row 2', 1],
                ['Row 3', 3]
            ]
        } as Data;
        const dataFalse = {
            title: 'Matrix',
            description: null,
            type: 'matrix',
            key: 'matrix',
            custom_key: null,
            value: [
                ['Col 1', 'Col 2', 'Col 3', 'Col 4'],
                ['Row 1', 1],
                ['Row 2', 2],
                ['Row 3', 3]
            ]
        } as Data;

        const submissions = createSubmission(dataTrue, dataFalse);
        const normalizedData = createNormalizedData(submissions);

        expect(normalizedData.toBeTrue).toEqual({
            [dataTrue.key]: '2,1,3'
        });
        expect(normalizedData.toBeFalse).toEqual({
            [dataFalse.key]: '1,2,3'
        });

        const clps = await evaluateRules(normalizedData);

        expect(clps.toBeTrue.chapters[1].recommendation).toBe(true);
        expect(clps.toBeFalse.chapters[1].recommendation).toBe(false);
    });

    it('should transform and evaluate a boolean rule', async () => {
        const dataTrue = {
            title: 'Boolean',
            description: null,
            type: 'yesNo',
            key: 'boolean',
            custom_key: null,
            value: 'Yes'
        } as Data;
        const dataFalse = {
            title: 'Boolean',
            description: null,
            type: 'yesNo',
            key: 'boolean',
            custom_key: null,
            value: 'No'
        } as Data;

        const submissions = createSubmission(dataTrue, dataFalse);
        const normalizedData = createNormalizedData(submissions);

        expect(normalizedData.toBeTrue).toEqual({
            [dataTrue.key]: dataTrue.value
        });
        expect(normalizedData.toBeFalse).toEqual({
            [dataFalse.key]: dataFalse.value
        });

        const clps = await evaluateRules(normalizedData);

        expect(clps.toBeTrue.chapters[2].recommendation).toBe(true);
        expect(clps.toBeFalse.chapters[2].recommendation).toBe(false);
    });

    it('should transform and evaluate a multiple-choice rule', async () => {
        const dataTrue = {
            title: 'Multiple Choice',
            description: null,
            type: 'yesNo',
            key: 'multiple_choice',
            custom_key: null,
            value: ['Exists']
        } as Data;
        const dataFalse = {
            title: 'Multiple Choice',
            description: null,
            type: 'choices',
            key: 'multiple_choice',
            custom_key: null,
            value: ['NotExists']
        } as Data;

        const submissions = createSubmission(dataTrue, dataFalse);
        const normalizedData = createNormalizedData(submissions);

        expect(normalizedData.toBeTrue).toEqual({
            [dataTrue.key]: dataTrue.value
        });
        expect(normalizedData.toBeFalse).toEqual({
            [dataFalse.key]: dataFalse.value
        });

        const clps = await evaluateRules(normalizedData);

        expect(clps.toBeTrue.chapters[3].recommendation).toBe(true);
        expect(clps.toBeFalse.chapters[3].recommendation).toBe(false);
    });

    it('should transform and evaluate a dropdown rule', async () => {
        const dataTrue = {
            title: 'Dropdown',
            description: null,
            type: 'dropdown',
            key: 'dropdown',
            custom_key: null,
            value: ['Selected']
        } as Data;
        const dataFalse = {
            title: 'Dropdown',
            description: null,
            type: 'dropdown',
            key: 'dropdown',
            custom_key: null,
            value: ['NotSelected']
        } as Data;

        const submissions = createSubmission(dataTrue, dataFalse);
        const normalizedData = createNormalizedData(submissions);

        expect(normalizedData.toBeTrue).toEqual({
            [dataTrue.key]: dataTrue.value
        });
        expect(normalizedData.toBeFalse).toEqual({
            [dataFalse.key]: dataFalse.value
        });

        const clps = await evaluateRules(normalizedData);

        expect(clps.toBeTrue.chapters[4].recommendation).toBe(true);
        expect(clps.toBeFalse.chapters[4].recommendation).toBe(false);
    });

    it('should transform and evaluate a rank rule', async () => {
        const dataTrue = {
            title: 'Rank',
            description: null,
            type: 'rank',
            key: 'rank',
            custom_key: null,
            value: ['B', 'A', 'C']
        } as Data;
        const dataFalse = {
            title: 'Rank',
            description: null,
            type: 'rank',
            key: 'rank',
            custom_key: null,
            value: ['A', 'B', 'C']
        } as Data;

        const submissions = createSubmission(dataTrue, dataFalse);
        const normalizedData = createNormalizedData(submissions);

        expect(normalizedData.toBeTrue).toEqual({
            [dataTrue.key]: dataTrue.value.join('\n')
        });
        expect(normalizedData.toBeFalse).toEqual({
            [dataFalse.key]: dataFalse.value.join('\n')
        });

        const clps = await evaluateRules(normalizedData);

        expect(clps.toBeTrue.chapters[5].recommendation).toBe(true);
        expect(clps.toBeFalse.chapters[5].recommendation).toBe(false);
    });
});
