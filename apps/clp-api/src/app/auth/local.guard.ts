import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err, _, info, context) {
        const request = context.switchToHttp().getRequest();
        const { email, password } = request.body;
        if (err || !email || !password) {
            if (!email) {
                throw new BadRequestException({ message: 'Email is required.' });
            } else if (!password) {
                throw new BadRequestException({ message: 'Password is required.' });
            } else {
                throw err || new UnauthorizedException();
            }
        }

        return super.handleRequest(err, { email, password }, info, context);
    }
}
