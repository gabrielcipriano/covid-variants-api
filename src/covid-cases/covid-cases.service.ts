import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './covid-cases.entity';
import { LocationVariantsDto } from './dtos/location-variants.dto';
import { ValidDateStr } from './types/valid-date-str.type';

@Injectable()
export class CovidCasesService {
  constructor(
    @InjectRepository(CovidCase)
    private readonly repository: Repository<CovidCase>,
  ) {}

  async countForDate(date: ValidDateStr): Promise<Array<LocationVariantsDto>> {
    const queryResult = this.repository
      .createQueryBuilder('covid_case')
      .where('covid_case.date = :date', { date })
      .getMany();
    return queryResult as unknown as Array<LocationVariantsDto>;
  }

  async cumulativeForDate(
    date: ValidDateStr,
  ): Promise<Array<LocationVariantsDto>> {
    const queryResult = this.repository
      .createQueryBuilder('covid_case')
      .where('covid_case.date = :date', { date })
      .getMany();
    return queryResult as unknown as Array<LocationVariantsDto>;
  }
}
