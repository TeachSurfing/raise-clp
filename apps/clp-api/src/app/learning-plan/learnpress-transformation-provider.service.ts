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

  private deriveInputType(paperFormType: PaperFormQuestionType) {
    switch (paperFormType) {
      case PaperFormQuestionType.address:
        return 'text';
      case PaperFormQuestionType.appointment:
        return 'date';
      case PaperFormQuestionType.calculations:
        return 'text';
      case PaperFormQuestionType.choices:
        return 'text';
      case PaperFormQuestionType.color:
        return 'text';
      case PaperFormQuestionType.country:
        return 'text';
      case PaperFormQuestionType.date:
        return 'date';
      case PaperFormQuestionType.dropdown:
        return 'text';
      case PaperFormQuestionType.email:
        return 'text';
      case PaperFormQuestionType.file:
        return 'text';
      case PaperFormQuestionType.hidden:
        return 'text';
      case PaperFormQuestionType.image:
        return 'text';
      case PaperFormQuestionType.matrix:
        return 'text';
      case PaperFormQuestionType.number:
        return 'text';
      case PaperFormQuestionType.phone:
        return 'text';
      case PaperFormQuestionType.price:
        return 'text';
      case PaperFormQuestionType.products:
        return 'text';
      case PaperFormQuestionType.rank:
        return 'text';
      case PaperFormQuestionType.rating:
        return 'number';
      case PaperFormQuestionType.scale:
        return 'number';
      case PaperFormQuestionType.signature:
        return 'text';
      case PaperFormQuestionType.slider:
        return 'text';
      case PaperFormQuestionType.text:
        return 'text';
      case PaperFormQuestionType.time:
        return 'time';
      case PaperFormQuestionType.url:
        return 'text';
      case PaperFormQuestionType.yesNo:
        return 'text';
      default:
      // return assertUnreachable(paperFormType);
    }
  }

  private deriveEditorType(paperFormType: PaperFormQuestionType) {
    switch (paperFormType) {
      case PaperFormQuestionType.address:
        return 'text';
      case PaperFormQuestionType.appointment:
        return 'date';
      case PaperFormQuestionType.calculations:
        return 'text';
      case PaperFormQuestionType.choices:
        return 'text';
      case PaperFormQuestionType.color:
        return 'text';
      case PaperFormQuestionType.country:
        return 'text';
      case PaperFormQuestionType.date:
        return 'date';
      case PaperFormQuestionType.dropdown:
        return 'select';
      case PaperFormQuestionType.email:
        return 'text';
      case PaperFormQuestionType.file:
        return 'text';
      case PaperFormQuestionType.hidden:
        return 'text';
      case PaperFormQuestionType.image:
        return 'text';
      case PaperFormQuestionType.matrix:
        return 'text';
      case PaperFormQuestionType.number:
        return 'text';
      case PaperFormQuestionType.phone:
        return 'text';
      case PaperFormQuestionType.price:
        return 'text';
      case PaperFormQuestionType.products:
        return 'text';
      case PaperFormQuestionType.rank:
        return 'text';
      case PaperFormQuestionType.rating:
        return 'text';
      case PaperFormQuestionType.scale:
        return 'text';
      case PaperFormQuestionType.signature:
        return 'text';
      case PaperFormQuestionType.slider:
        return 'text';
      case PaperFormQuestionType.text:
        return 'text';
      case PaperFormQuestionType.time:
        return 'time';
      case PaperFormQuestionType.url:
        return 'text';
      case PaperFormQuestionType.yesNo:
        return 'select';
      default:
      // return assertUnreachable(paperFormType);
    }
  }

  private deriveValues(
    options: string[],
    paperFormType: PaperFormQuestionType
  ) {
    if (paperFormType === PaperFormQuestionType.yesNo)
      return [
        { name: 'yes', label: 'yes' },
        { name: 'no', label: 'no' },
      ];
    return options?.map((option) => ({ name: option, label: option }));
  }

  private deriveOperators(paperFormType: PaperFormQuestionType) {
    if (paperFormType === PaperFormQuestionType.yesNo)
      return defaultOperators.filter((op) => op.name === '=');
    return defaultOperators;
  }
}
