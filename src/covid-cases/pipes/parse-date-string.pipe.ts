import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { toValidDateStr, ValidDateStr } from '../types/valid-date-str.type';

@Injectable()
export class ParseDateStringPipe implements PipeTransform<any, ValidDateStr> {
  errorString =
    "Incoming date is not formatted correctly. Expected format: 'YYYY-MM-DD'. ";

  transform(value: any): ValidDateStr {
    if (typeof value !== 'string') {
      throw new BadRequestException(this.errorString + 'Must be a string.');
    }

    try {
      return toValidDateStr(value);
    } catch (error) {
      throw new BadRequestException(this.errorString + error.message);
    }
  }
}
