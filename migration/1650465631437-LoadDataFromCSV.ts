import { readCsv, rowParser } from './../populate-database-csv-helper';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { CovidCase } from './../src/covid-cases/covid-cases.entity';
import * as path from 'path';

const csvDirRelative = '../../data/covid-variants.csv';

const csvDirname = path.join(__dirname, csvDirRelative);

export class LoadDataFromCSV1650465631437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(
      'POPULATING COVID-CASES DATABASE USING THE FOLLOWING CSV FILE: ' +
        csvDirname,
    );

    const data: any[] = await readCsv(csvDirname, { headers: true }, rowParser);

    queryRunner.manager
      .createQueryBuilder(queryRunner)
      .insert()
      .into(CovidCase)
      .values(data)
      .execute();

    console.log(`ROWS WITH 'num_sequences'=0 WERE THROWN AWAY.`);
    console.log(`LOAD ${data.length} ROWS IN THE DATABASE. `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('!!!! DOING NOTHING !!!!');
    console.log('REVERSING THE MIGRATION BUT DOING NOTHING WITH THE DATA');
  }
}
