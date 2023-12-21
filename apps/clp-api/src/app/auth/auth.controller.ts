import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { omit } from 'lodash';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { LocalAuthGuard } from './local.guard';
import { Public } from './public.decorator';

@Controller()
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: Request & { user: Partial<User> }) {
        return this.authService.login(req.user);
    }

    @Public()
    @Post('register')
    async register(@Body() user: User) {
        return this.authService.register(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: Request & { user: Partial<User> }) {
        return omit(req.user, ['tokenVersion']);
    }
}
