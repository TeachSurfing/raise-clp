import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { INewLearningPlanPayload, IUser } from '@raise-clp/models';
import { LearningPlanService } from './learning-plan.service';

@Controller({ path: 'learning-plans' })
export class LearningPlanController {
    constructor(private readonly learningPlanService: LearningPlanService) {}

    @Get()
    findAll(@Request() { user }: Request & { user: Partial<IUser> }) {
        return this.learningPlanService.findAll(user.id);
    }

    @Post()
    addLearningPlan(
        @Request() req: Request & { user: Partial<IUser> },
        @Body() body: INewLearningPlanPayload
    ) {
        return this.learningPlanService.addLearningPlan(body, req.user.id);
    }

    @Get(':id')
    findOne(@Param() { id }) {
        return this.learningPlanService.findOne(id);
    }

    @Post(':id')
    updateLearningPlan(@Param() params, @Body() body: { safety: boolean }) {
        if (!body.safety)
            return new HttpException(
                'WARNING! Calling this endpoint will potentially corrupt data, please only continue when you know what you are doing and set the "safety" paramter explicitly to "true"!',
                HttpStatus.BAD_REQUEST
            );
        return this.learningPlanService.updateLearningPlan(params.id);
    }

    @Get(':id/questions')
    async getQuestions(@Param() params) {
        return await this.learningPlanService.getQuestions(params.id);
    }

    @Get(':id/chapters/:cid')
    getChapters() {
        return true;
    }

    @Post(':id/chapters/:cid')
    updateChapter(@Param() params, @Body() body: { rule: any }) {
        if (!body || !body.rule) throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);

        return this.learningPlanService.updateChapterRule(params.id, params.cid, body.rule);
    }

    @Post(':id/chapters/:cid/units/:uid')
    updateUnit(@Param() params, @Body() body: { rule: any }) {
        if (!body || !body.rule) throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);

        return this.learningPlanService.updateUnitRule(params.id, params.cid, params.uid, body.rule);
    }
}
