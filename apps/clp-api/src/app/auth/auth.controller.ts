import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { omit } from 'lodash';
import { User } from '../users/user.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { LocalAuthGuard } from './local.guard';
import { Public } from './public.decorator';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: Request & { user: Partial<User> }, @Res({ passthrough: true }) res) {
        const loginResponse = await this.authService.login(req.user);
        res.cookie('_auth', loginResponse.token, { httpOnly: true, sameSite: 'None', secure: true });
        return loginResponse;
    }

    @Public()
    @Post('logout')
    async logout(@Res({ passthrough: true }) res) {
        res.cookie('_auth', 'expired', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            expires: new Date(0)
        });
        return true;
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
