import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './covid-cases.entity';
import { ValidDateStr } from './types/valid-date-str.type';

import { LocationVariantsRecord } from './types/location-variants-record.type';
import { groupResultsByLocation } from './covid-cases.service.helpers';

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
      .select('location, variant, sum(num_sequences)::integer as num_sequences')
      .where('covid_case.date <= :date', { date: _date })
      .groupBy('covid_case.location')
      .cache(30000) //30 seconds
      .addGroupBy('covid_case.variant')
      .getRawMany<CovidCase>();

    return groupResultsByLocation(queryResult);
  }

  async allDates(): Promise<string[]> {
    /*
      Due to a limitation/bug of TypeORM,
      when 'QueryBuilder' is used, date values comes with timezone:
      "2022-04-02T03:00:00.000Z" instead of the expected "YYYY-MM-DD"
      
      In the other side,
      
      Without queryBuild it's not possible to use 'DISTINCT'
      
      We must choose one of them: get distinct results but manipulate the 
      strings to remove the timezone part, OR get the dates in the correct 
      format, but with repeated results

      Thinking about the data, lets say we have 50 countries in the DB, 
      and 20 covid variants being registered for each day (date), that means 
      that we'll have 1000 repeated values for each date.

      A deeper analysis is needed to say which option is the best one, in 
      matters of network load and processing time. 
      For now, we can move on getting distinct values and manipulating the 
      strings to get them in the correct format.

     --------------- fixed with CAST(date AS TEXT) ----------------
    */

    const queryResult = await this.repository
      .createQueryBuilder()
      .select('distinct CAST(date AS TEXT) as date')
      .cache(30000) //30 seconds cache
      .getRawMany<CovidCase>();

    //  [{date: '2022-04-02'}, {date: '2020-04-02'}]
    //  -> ['2022-04-02','2020-04-02']
    return queryResult.map((row) => row.date);
  }
}
