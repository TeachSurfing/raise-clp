import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';

@Controller({ path: 'questionnaire' })
export class QuestionnaireController {
  constructor(private readonly service: QuestionnaireService) {}

  @Get(':id')
  async findOne(@Param() params) {
    return await this.service.get(params.id);
  }

  @Post()
  async updateAnswers(@Body() body: { data: any; safety: boolean }) {
    if (!body.safety)
      return new HttpException(
        'WARNING! Calling this endpoint will potentially corrupt data, please only continue when you know what you are doing and set the "safety" paramter explicitly to "true"!',
        HttpStatus.BAD_REQUEST
      );
    return await this.service.updateQuestionnaire(body.data);
  }
}
