import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { defaultOperators } from 'react-querybuilder';
import { catchError, firstValueFrom, forkJoin, map } from 'rxjs';
import {
  PaperformFormDto,
  PaperFormQuestionType,
} from '../models/paperform-submission.dto';
import { Chapter, LearningPlan, Question } from './learning-plan.schema';
import { LearningplanTransformationProvider } from './learningplan-transformation-provider.service';

@Injectable()
export class LearnpressTransformationProvider
  implements LearningplanTransformationProvider
{
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  transform(data: {
    lpUrl: string;
    questionnaireUrl: string;
  }): Promise<LearningPlan> {
    return firstValueFrom(
      forkJoin({
        learningPlan: this.httpService.get(data.lpUrl),
        questionnaireData: this.httpService.get(data.questionnaireUrl, {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'PAPERFORM_ACCESS_TOKEN'
            )}`,
          },
        }),
      }).pipe(
        map((response) => ({
          learningPlan: response.learningPlan.data,
          questionnaireData: response.questionnaireData.data.results.fields,
        })),
        map(
          (data) =>
            new LearningPlan(
              undefined,
              plainToInstance(
                Chapter,
                data.learningPlan.sections as Chapter[],
                {
                  excludeExtraneousValues: true,
                }
              ),
              this.extractNameLabel(data.questionnaireData)
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
          this.deriveInputType(d.type),
          this.deriveEditorType(d.type),
          this.deriveValues(d.options, d.type),
          this.deriveOperators(d.type)
        )
    );
  }

  // TODO: matrix, rank

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
        return 'select';
      case PaperFormQuestionType.yesNo:
        return 'select';
      default:
        return 'text';
    }
  }

  private deriveValues(
    options: string[],
    paperFormType: PaperFormQuestionType
  ) {
    switch (paperFormType) {
      case PaperFormQuestionType.yesNo:
        return [
          { name: 'yes', label: 'yes' },
          { name: 'no', label: 'no' },
        ];
      default:
        return options?.map((option) => ({ name: option, label: option }));
    }
  }

  private deriveOperators(paperFormType: PaperFormQuestionType) {
    switch (paperFormType) {
      case PaperFormQuestionType.yesNo:
      case PaperFormQuestionType.dropdown:
        return defaultOperators.filter((op) => op.name === '=');
      case PaperFormQuestionType.choices:
        return defaultOperators.filter((op) => op.name === 'contains');
      case PaperFormQuestionType.rating:
        return defaultOperators.filter((op) =>
          ['=', '<=', '>=', '<', '>'].includes(op.name)
        );
      default:
        return defaultOperators;
    }
  }
}
