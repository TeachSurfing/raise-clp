// import {
//   Body,
//   Controller,
//   Get,
//   HttpException,
//   HttpStatus,
//   Param,
//   Post,
// } from '@nestjs/common';
// import { QuestionnaireService } from './questionnaire.service';

// @Controller({ path: 'questionnaire' })
// export class QuestionnaireController {
//   constructor(private readonly service: QuestionnaireService) {}

//   @Get()
//   async findAll() {
//     return await this.service.getAll();
//   }

//   @Get(':id')
//   async findOne(@Param() params) {
//     return await this.service.get(params.id);
//   }

//   @Post()
//   async addQuestionnaire(@Body() body: { data: any }) {
//     return await this.service.addQuestionnaire(body.data);
//   }

//   @Post(':id')
//   async updateQuestionnaire(
//     @Param() params,
//     @Body() body: { data: any; safety: boolean }
//   ) {
//     if (!body.safety)
//       return new HttpException(
//         'WARNING! Calling this endpoint will potentially corrupt data, please only continue when you know what you are doing and set the "safety" paramter explicitly to "true"!',
//         HttpStatus.BAD_REQUEST
//       );
//     return await this.service.updateQuestionnaire(params.id, body.data);
//   }
// }
