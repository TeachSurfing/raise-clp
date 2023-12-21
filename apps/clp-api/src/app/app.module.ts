import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LearningPlanController } from './learning-plan/learning-plan.controller';
import { LearningPlan, LearningPlanSchema } from './learning-plan/learning-plan.schema';
import { LearningPlanService } from './learning-plan/learning-plan.service';
import { LearningplanTransformationProvider } from './learning-plan/learningplan-transformation-provider.service';
import { LearnpressTransformationProvider } from './learning-plan/learnpress-transformation-provider.service';
import { MailModule } from './mail/mail.module';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { Submission, SubmissionSchema } from './submission/submission.schema';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        HttpModule,
        MongooseModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                uri: config.get('MONGO_URI')
            }),
            inject: [ConfigService]
        }),
        MongooseModule.forFeature([
            { name: LearningPlan.name, schema: LearningPlanSchema },
            { name: Submission.name, schema: SubmissionSchema }
        ]),
        MailModule,
        AuthModule,
        UsersModule
    ],
    controllers: [AppController, LearningPlanController],
    providers: [
        AppService,
        LearningPlanService,
        {
            provide: LearningplanTransformationProvider,
            useClass: LearnpressTransformationProvider
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class AppModule {}
