import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { LearningPlanService } from './learning-plan.service';

@Controller({ path: 'learning-plan' })
export class LearningPlanController {
  constructor(private readonly service: LearningPlanService) {}

  @Post()
  updateLearningPlan(@Body() body: { url: string; safety: boolean }) {
    if (!body.safety)
      return new HttpException(
        'WARNING! Calling this endpoint will potentially corrupt data, please only continue when you know what you are doing and set the "safety" paramter explicitly to "true"!',
        HttpStatus.BAD_REQUEST
      );
    return this.service.updateLearningPlan(body.url);
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.service.find(params.id);
  }

  @Post(':id')
  updateUnit(
    @Param() params,
    @Body() body: { chapterId: number; unitId?: number; rule: any }
  ) {
    if (!body || !body.chapterId || !body.rule)
      throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);

    if (body.unitId === undefined || body.unitId === null)
      return this.service.updateChapterRule(
        params.id,
        body.chapterId,
        body.rule
      );
    return this.service.updateUnitRule(
      params.id,
      body.chapterId,
      body.unitId,
      body.rule
    );
  }
}
