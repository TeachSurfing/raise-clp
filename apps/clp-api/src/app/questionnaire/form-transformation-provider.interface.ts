import { Injectable } from '@nestjs/common';
import { Field } from 'react-querybuilder';

@Injectable()
export abstract class FormTransformationProvider {
  abstract transform(formData: any): Field[];
}
