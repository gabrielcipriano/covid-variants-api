import { MigrationInterface, QueryRunner } from 'typeorm';
import * as csv from '@fast-csv/parse';
import { CovidCase } from './../src/covid-cases/covid-cases.entity';

const csvDirRelative = '/data/covid-variants.csv';

const csvDirname = __dirname + csvDirRelative;

// get only:
// 0: location - this is the country for which the variants information is provided;
// 1: date - date for the data entry;
// 2: variant - this is the variant corresponding to this data entry;
// 3: num_sequences - the number of sequences processed (for the country, variant and date);
// and only entries that num_sequences > 0
function rowParser(rowObj: any): any | null {
  const { perc_sequences, num_sequences_total, ...obj } = rowObj;
  obj.num_sequences = parseInt(obj.num_sequences);
  return obj.num_sequences !== 0 ? obj : null;
}

function readCsv(path, options, rowParser): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const data = [];

    csv
      .parseFile(path, options)
      .on('error', reject)
      .on('data', (obj) => {
        const target = rowParser(obj);
        if (target) data.push(target);
      })
      .on('end', (rowCount: number) => {
        console.log(`PARSED ${rowCount} CSV ROWS. `);
        resolve(data);
      });
  });
}

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
