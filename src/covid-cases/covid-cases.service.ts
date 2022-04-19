import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './covid-cases.entity';
import { ValidDateStr } from './types/valid-date-str.type';

import { LocationVariantsRecord } from './types/location-variants-record.type';

function groupResultsByLocation(
  queryResult: CovidCase[],
): LocationVariantsRecord {
  return queryResult.reduce((record: LocationVariantsRecord, currentRow) => {
    const { location, variant, num_sequences } = currentRow;
    if (!record[location]) record[location] = {};
    record[location][variant] = num_sequences;
    return record;
  }, {});
}

@Injectable()
export class CovidCasesService {
  constructor(
    @InjectRepository(CovidCase)
    private readonly repository: Repository<CovidCase>,
  ) {}

  async countForDate(date: ValidDateStr): Promise<LocationVariantsRecord> {
    const queryResult = await this.repository.find({ date });

    return groupResultsByLocation(queryResult);
  }

  async cumulativeForDate(
    _date: ValidDateStr,
  ): Promise<LocationVariantsRecord> {
    const queryResult = await this.repository
      .createQueryBuilder('covid_case')
      .select('location, variant, sum(num_sequences) as num_sequences')
      .where('covid_case.date <= :date', { date: _date })
      .groupBy('covid_case.location')
      .addGroupBy('covid_case.variant')
      .getRawMany<CovidCase>();

    return groupResultsByLocation(queryResult);
  }
}
