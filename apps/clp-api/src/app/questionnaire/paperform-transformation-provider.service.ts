import { Injectable } from '@nestjs/common';
import { Field } from 'react-querybuilder';
import { FormTransformationProvider } from './form-transformation-provider.interface';

@Injectable()
export class PaperformTransformationProvider
  implements FormTransformationProvider
{
  transform(formData: any): Field[] {
    return undefined;
  }
}
