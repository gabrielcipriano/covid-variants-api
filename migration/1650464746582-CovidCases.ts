import { MigrationInterface, QueryRunner } from 'typeorm';

export class CovidCases1650464746582 implements MigrationInterface {
  name = 'CovidCases1650464746582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "covid_case" ("location" character varying NOT NULL, "date" date NOT NULL, "variant" character varying NOT NULL, "num_sequences" integer NOT NULL, CONSTRAINT "PK_689512460e1dcc414b0a5d58aa2" PRIMARY KEY ("location", "date", "variant"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "covid_case"`);
  }
}
