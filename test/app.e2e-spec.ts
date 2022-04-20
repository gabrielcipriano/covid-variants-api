import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CovidCasesModule } from './../src/covid-cases/covid-cases.module';
import { CovidCasesService } from './../src/covid-cases/covid-cases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './../src/covid-cases/covid-cases.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let covidCasesService: CovidCasesService;
  let repo: Repository<CovidCase>;

  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CovidCasesModule],
      // providers: [CovidCasesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.useLogger(new TestLogger())
    await app.init();

    repo = app.get<Repository<CovidCase>>(getRepositoryToken(CovidCase));

    await repo.save([
      new CovidCase('Brazil', '2022-04-02', 'Omicron', 500),
      new CovidCase('Brazil', '2021-02-02', 'Omicron', 300),
      new CovidCase('Brazil', '2022-03-02', 'Alpha', 100),
      new CovidCase('Italy', '2022-04-02', 'Omicron', 100),
      new CovidCase('Italy', '2022-04-02', 'Delta', 50),
    ]);
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Backend Challenge 2021 🏅 - Covid Daily Cases');
  });

  describe('/count/:date', () => {
    it('/count/2022-04-02 [a good date value] (GET)', async () => {
      return request(app.getHttpServer())
        .get('/count/2022-04-02')
        .expect(200)
        .expect({
          Brazil: { Omicron: 500 },
          Italy: { Omicron: 100, Delta: 50 },
        });
    });

    it('/count/2022-05-02 [a good date value, but no records for the date] (GET)', async () => {
      return request(app.getHttpServer())
        .get('/count/2022-05-02')
        .expect(200)
        .expect({});
    });

    it('/count/2222-99-99 [a invalid date] (GET)', async () => {
      const date = '2222-99-99';
      return request(app.getHttpServer())
        .get('/count/' + date)
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            "Incoming date is not formatted correctly. Expected format: 'YYYY-MM-DD'. Invalid date string: " +
            date,
          error: 'Bad Request',
        });
    });

    it('/count/abcdef [a invalid value] (GET)', async () => {
      const date = 'abcdef';
      return request(app.getHttpServer())
        .get('/count/' + date)
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            "Incoming date is not formatted correctly. Expected format: 'YYYY-MM-DD'. Invalid date string: " +
            date,
          error: 'Bad Request',
        });
    });
  });

  describe('/cumulative/:date', () => {
    it('/cumulative/2022-04-02 [a good date value] (GET)', async () => {
      return request(app.getHttpServer())
        .get('/cumulative/2022-04-02')
        .expect(200)
        .expect({
          Brazil: { Alpha: 100, Omicron: 800 },
          Italy: { Delta: 50, Omicron: 100 },
        });
    });

    it('/cumulative/1997-11-20 [a good date value, but no records for the date] (GET)', async () => {
      return request(app.getHttpServer())
        .get('/cumulative/1997-11-20')
        .expect(200)
        .expect({});
    });

    it('/cumulative/2222-99-99 [a invalid date] (GET)', async () => {
      const date = '2222-99-99';
      return request(app.getHttpServer())
        .get('/cumulative/' + date)
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            "Incoming date is not formatted correctly. Expected format: 'YYYY-MM-DD'. Invalid date string: " +
            date,
          error: 'Bad Request',
        });
    });

    it('/cumulative/abcdef [a invalid value] (GET)', async () => {
      const date = 'abcdef';
      return request(app.getHttpServer())
        .get('/cumulative/' + date)
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            "Incoming date is not formatted correctly. Expected format: 'YYYY-MM-DD'. Invalid date string: " +
            date,
          error: 'Bad Request',
        });
    });
  });

  describe('/dates', () => {
    it('/dates [returns a list of unique dates in the database] (GET)', async () => {
      return request(app.getHttpServer())
        .get('/dates')
        .expect(200)
        .expect(['2021-02-02', '2022-03-02', '2022-04-02']);
    });
  });
});
