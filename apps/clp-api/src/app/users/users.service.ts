import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) {}

    async create({ email, name, password, organizationName }: Partial<User>): Promise<Partial<User> | null> {
        const newUser = {
            email,
            name,
            organizationName,
            password,
            tokenVersion: 0
        };

        return await this.userModel.create(newUser);
    }

    async updateById(id: string, updateDTO: Partial<User>) {
        return await this.userModel.updateOne({ _id: id }, { ...updateDTO });
    }

    async findOneByEmail(email: string): Promise<Partial<User> | null> {
        const user = await this.userModel.findOne({ email });
        return user ? (user.toJSON() as Partial<User>) : null;
    }

    async findOneById(id: string): Promise<Partial<User> | null> {
        const user = await this.userModel.findOne({ id });
        return user ? omit(user.toJSON(), ['password']) : null;
    }

    async getProfile(email: string): Promise<Partial<User> | null> {
        const user = await this.userModel.findOne({ email });
        return user ? omit(user.toJSON(), ['password']) : null;
    }
}
