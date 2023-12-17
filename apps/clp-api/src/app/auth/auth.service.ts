import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { omit } from 'lodash';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { saltRounds } from './auth.constants';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<Partial<User>> {
        const foundUser = await this.usersService.findOneByEmail(email);

        if (!foundUser) {
            throw new NotFoundException({
                message: 'User not registered yet.'
            });
        }

        const authPassed = await compare(password, foundUser.password);
        // Increment the user's token version
        const tokenVersion = (foundUser.tokenVersion += 1);
        await this.usersService.updateById(foundUser._id, { tokenVersion });

        if (authPassed) {
            return omit(foundUser, ['password']);
        }
        return null;
    }

    async login({ email, password }: Partial<User>) {
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException({
                message: 'Invalid username or password.'
            });
        }

        const payload = { id: user._id, tokenVersion: user.tokenVersion, email: user.email, name: user.name };

        return {
            message: `Logged in as ${email}`,
            token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                organizationName: user.organizationName
            }
        };
    }

    async register(user: User) {
        const foundUser = await this.usersService.findOneByEmail(user.email);

        if (foundUser) {
            throw new ConflictException({
                message: 'User already registered.'
            });
        }

        const hashedPassword = await hash(user.password, saltRounds);
        const newUser = await this.usersService.create({ ...user, password: hashedPassword });

        return {
            message: `${user.email} has been successfully registered!`,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                organizationName: newUser.organizationName
            }
        };
    }
}
