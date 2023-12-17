import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies?._auth || '']),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }

    async validate({ id, email, name, tokenVersion }) {
        const foundUser = await this.usersService.findOneByEmail(email);

        if (!foundUser) {
            throw new NotFoundException({ message: 'User not registered yet.' });
        }
        if (tokenVersion !== foundUser.tokenVersion) {
            throw new UnauthorizedException({
                message: 'Invalid or expired token.'
            });
        }

        return { id, email, name, tokenVersion };
    }
}
