import { ValidDateStr } from '../types/valid-date-str.type';
import { VariantSequencesDto } from './variant-sequences.dto';

export class LocationVariantsDto {
  location: string;
  date: ValidDateStr;
  variants: Array<VariantSequencesDto>;

  constructor(location: string, date: ValidDateStr) {
    this.location = location;
    this.date = date;
    this.variants = [];
  }
}
