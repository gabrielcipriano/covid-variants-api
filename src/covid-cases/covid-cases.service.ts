import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './covid-cases.entity';
import { CovidCasesRepository } from './covid-cases.repository';
import { LocationVariantsDto } from './dtos/location-variants.dto';
import { ValidDateStr } from './types/valid-date-str.type';

@Injectable()
export class CovidCasesService {
  constructor(
    @InjectRepository(CovidCase)
    private readonly repository: CovidCasesRepository,
  ) {}

  async countForDate(date: ValidDateStr): Promise<Array<LocationVariantsDto>> {
    const result = this.repository.countForDate(date);
    return result;
  }

  async cumulativeForDate(
    date: ValidDateStr,
  ): Promise<Array<LocationVariantsDto>> {
    const result = this.repository.cumulativeForDate(date);
    return result;
  }
}
