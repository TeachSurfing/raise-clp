import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Chapter, LearningPlan } from './learning-plan.schema';
import { LearningplanTransformationProvider } from './learningplan-transformation-provider.service';

@Injectable()
export class LearnpressTransformationProvider
  implements LearningplanTransformationProvider
{
  constructor(private readonly httpService: HttpService) {}

  transform(url: string): Promise<LearningPlan> {
    return firstValueFrom(
      this.httpService.get(url).pipe(
        map((response) => response.data),
        map(
          (data: { id: number; sections: [] }) =>
            new LearningPlan(
              data.id,
              plainToInstance(Chapter, data.sections, {
                excludeExtraneousValues: true,
              })
            )
        ),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      )
    );
  }
}
