import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FieldValueType, INewLearningPlan } from '@raise-clp/models';
import { plainToInstance } from 'class-transformer';
import { defaultOperators } from 'react-querybuilder';
import { catchError, firstValueFrom, forkJoin, map } from 'rxjs';
import { PaperFormQuestionType, PaperformFormDto } from '../models/paperform-submission.dto';
import { Chapter, LearningPlan, Question } from './learning-plan.schema';
import { LearningplanTransformationProvider } from './learningplan-transformation-provider.service';

@Injectable()
export class LearnpressTransformationProvider implements LearningplanTransformationProvider {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    async transform(newLP: INewLearningPlan): Promise<LearningPlan> {
        return firstValueFrom(
            forkJoin({
                learningPlan: this.httpService.get(newLP.courseUrl),
                questionnaireData: this.httpService.get(newLP.questionnaireUrl, {
                    headers: {
                        Authorization: `Bearer ${newLP.paperformToken}`
                    }
                })
            }).pipe(
                map((response) => ({
                    learningPlan: response.learningPlan.data,
                    questionnaireData: response.questionnaireData.data.results.fields
                })),
                map(
                    (transformedData) =>
                        new LearningPlan(
                            undefined,
                            newLP.name,
                            newLP.description,
                            plainToInstance(Chapter, transformedData.learningPlan.sections as Chapter[], {
                                excludeExtraneousValues: true
                            }),
                            this.extractNameLabel(transformedData.questionnaireData),
                            newLP.courseUrl,
                            newLP.lpOptionalUrl,
                            newLP.questionnaireUrl,
                            newLP.paperformToken,
                            newLP.userId
                        )
                ),
                catchError((e) => {
                    console.error(e);

                    throw new HttpException(
                        e.response?.data ?? 'Unknown Error',
                        e.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
                    );
                })
            )
        );
    }

    private extractNameLabel(submission: PaperformFormDto[]): Question[] {
        return submission.map(
            (d) =>
                new Question(
                    d.custom_key ?? d.key,
                    d.title,
                    this.deriveValueType(d.type),
                    this.deriveInputType(d.type),
                    this.deriveEditorType(d.type),
                    this.deriveValues(d.options, d.type),
                    this.deriveOperators(d.type)
                )
        );
    }

    private deriveValueType(paperFormType: PaperFormQuestionType) {
        switch (paperFormType) {
            case PaperFormQuestionType.appointment:
            case PaperFormQuestionType.date:
            case PaperFormQuestionType.time:
                return FieldValueType.date;
            case PaperFormQuestionType.rating:
            case PaperFormQuestionType.scale:
                return FieldValueType.number;
            case PaperFormQuestionType.yesNo:
                return FieldValueType.boolean;
            default:
                return FieldValueType.string;
        }
    }

    private deriveInputType(paperFormType: PaperFormQuestionType) {
        switch (paperFormType) {
            case PaperFormQuestionType.appointment:
                return 'date';
            case PaperFormQuestionType.date:
                return 'date';
            case PaperFormQuestionType.rating:
                return 'number';
            case PaperFormQuestionType.scale:
                return 'number';
            case PaperFormQuestionType.time:
                return 'time';
            default:
                return 'text';
        }
    }

    private deriveEditorType(paperFormType: PaperFormQuestionType) {
        switch (paperFormType) {
            case PaperFormQuestionType.appointment:
                return 'date';
            case PaperFormQuestionType.choices:
                return 'select';
            case PaperFormQuestionType.date:
                return 'date';
            case PaperFormQuestionType.dropdown:
            case PaperFormQuestionType.yesNo:
                return 'select';
            case PaperFormQuestionType.rank:
                return 'textarea';
            default:
                return 'text';
        }
    }

    private deriveValues(options: string[], paperFormType: PaperFormQuestionType) {
        switch (paperFormType) {
            case PaperFormQuestionType.yesNo:
                return [
                    { name: 'Yes', label: 'Yes' },
                    { name: 'No', label: 'No' }
                ];
            default:
                return options?.map((option) => ({ name: option, label: option }));
        }
    }

    private deriveOperators(paperFormType: PaperFormQuestionType) {
        switch (paperFormType) {
            case PaperFormQuestionType.yesNo:
            case PaperFormQuestionType.dropdown:
            case PaperFormQuestionType.matrix:
            case PaperFormQuestionType.rank:
                return defaultOperators.filter((op) => op.name === '=');
            case PaperFormQuestionType.choices:
                return defaultOperators.filter((op) => op.name === 'contains');
            case PaperFormQuestionType.rating:
                return defaultOperators.filter((op) => ['=', '<=', '>=', '<', '>'].includes(op.name));
            default:
                return defaultOperators;
        }
    }
}
