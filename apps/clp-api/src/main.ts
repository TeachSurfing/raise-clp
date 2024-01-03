/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { NotFoundInterceptor } from './app/util/not-found.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3333;
    const corsFrom = process.env.DEPLOY_TARGET_FRONTEND || 'http://localhost:4200';
    app.useGlobalInterceptors(new NotFoundInterceptor('Entity not found'));
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    app.enableCors({
        origin: corsFrom,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
