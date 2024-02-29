import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { IUser } from '@raise-clp/models';
import { LearningPlanOwnerGuard } from './guards/learning-plan-owner.guard';
import { CreateLearningPlanGuard } from './guards/learning-plan.guard';
import { NewLearningPlanDTO } from './learning-plan.schema';
import { LearningPlanService } from './learning-plan.service';

@Controller({ path: 'learning-plans' })
export class LearningPlanController {
    constructor(private readonly learningPlanService: LearningPlanService) {}

    @Get()
    findAll(@Request() { user }: Request & { user: Partial<IUser> }) {
        return this.learningPlanService.findAll(user.id);
    }

    @Post()
    @UseGuards(CreateLearningPlanGuard)
    addLearningPlan(@Request() req: Request & { user: Partial<IUser> }, @Body() body: NewLearningPlanDTO) {
        return this.learningPlanService.addLearningPlan(body, req.user.id);
    }

    @Get(':id')
    @UseGuards(LearningPlanOwnerGuard)
    findOne(@Param() { id }) {
        return this.learningPlanService.findOne(id);
    }

    @Post(':id')
    @UseGuards(LearningPlanOwnerGuard)
    updateLearningPlan(@Param() params, @Body() body: { safety: boolean }) {
        if (!body.safety)
            return new HttpException(
                'WARNING! Calling this endpoint will potentially corrupt data, please only continue when you know what you are doing and set the "safety" paramter explicitly to "true"!',
                HttpStatus.BAD_REQUEST
            );
        return this.learningPlanService.updateLearningPlan(params.id);
    }

    @Get(':id/questions')
    @UseGuards(LearningPlanOwnerGuard)
    async getQuestions(@Param() params) {
        return await this.learningPlanService.getQuestions(params.id);
    }

    @Get(':id/chapters/:cid')
    @UseGuards(LearningPlanOwnerGuard)
    getChapters() {
        return true;
    }

    @Post(':id/chapters/:cid')
    @UseGuards(LearningPlanOwnerGuard)
    updateChapter(@Param() params, @Body() body: { rule: any }) {
        if (!body || !body.rule) throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);

        return this.learningPlanService.updateChapterRule(params.id, params.cid, body.rule);
    }

    @Post(':id/chapters/:cid/units/:uid')
    @UseGuards(LearningPlanOwnerGuard)
    updateUnit(@Param() params, @Body() body: { rule: any }) {
        if (!body || !body.rule) throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);

        return this.learningPlanService.updateUnitRule(params.id, params.cid, params.uid, body.rule);
    }

    @Delete(':id')
    @UseGuards(LearningPlanOwnerGuard)
    deleteById(@Param() { id }) {
        return this.learningPlanService.deleteOne(id);
    }
}
