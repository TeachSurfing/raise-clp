import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@raise-clp/models';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
    timestamps: true,
    toJSON: {
        transform(_, ret, __) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})
export class User implements IUser {
    _id?: string;
    id?: string;

    @Prop()
    @IsNotEmpty()
    email: string;

    @Prop()
    @IsNotEmpty()
    name: string;

    @Prop()
    @IsOptional()
    organizationName: string;

    @Prop()
    @IsNotEmpty()
    password: string;

    @Prop()
    tokenVersion: number;

    constructor(email: string, name: string, password: string) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.tokenVersion = 0;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
