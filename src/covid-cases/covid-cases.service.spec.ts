import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './covid-cases.entity';
import { CovidCasesService } from './covid-cases.service';
import { ValidDateStr } from './types/valid-date-str.type';
import { LocationVariantsRecord } from './types/location-variants-record.type';

const DATE = '2022-04-02' as ValidDateStr;

const cumulativeResultQueryBuilder = {
  select: () => cumulativeResultQueryBuilder,
  where: () => cumulativeResultQueryBuilder,
  groupBy: () => cumulativeResultQueryBuilder,
  addGroupBy: () => cumulativeResultQueryBuilder,
  getMany: () => [
    {
      location: 'Brazil',
      variant: 'Delta',
      sum: 150,
    },
    {
      location: 'Brazil',
      variant: 'Omicron',
      sum: 50,
    },
    {
      location: 'Italy',
      variant: 'Omicron',
      sum: 200,
    },
  ],
};

describe('CovidCasesService', () => {
  let service: CovidCasesService;
  let repo: Repository<CovidCase>;
  // let spy_querybuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CovidCasesService,
        {
          provide: getRepositoryToken(CovidCase),
          // useClass: Repository,
          useValue: {
            find: jest
              .fn()
              .mockImplementation(async ({}: any) => [
                new CovidCase('Brazil', '2022-04-02', 'Delta', 100),
                new CovidCase('Brazil', '2022-04-02', 'Omicron', 500),
                new CovidCase('Italy', '2022-04-02', 'Delta', 200),
              ]),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              addGroupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockReturnValueOnce([
                {
                  location: 'Brazil',
                  variant: 'Delta',
                  num_sequences: 150,
                },
                {
                  location: 'Brazil',
                  variant: 'Omicron',
                  num_sequences: 500,
                },
                {
                  location: 'Italy',
                  variant: 'Omicron',
                  num_sequences: 200,
                },
              ]),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<CovidCasesService>(CovidCasesService);
    repo = module.get<Repository<CovidCase>>(getRepositoryToken(CovidCase));
    // spy_querybuilder = jest.spyOn(repo, 'createQueryBuilder');
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should call the repository', async () => {
    await service.countForDate(DATE);
    expect(repo.find).toHaveBeenCalled();
  });

  describe('countForDate', () => {
    it('should be defined', async () => {
      expect(service.countForDate).toBeDefined();
    });

    it('should call repository`s find with a date.', async () => {
      service.countForDate(DATE);
      expect(repo.find).toHaveBeenCalledWith({ date: DATE });
    });

    it('should return results grouped by location for a given date', async () => {
      const expectedResult: LocationVariantsRecord = {
        Brazil: {
          Delta: 100,
          Omicron: 500,
        },
        Italy: {
          Delta: 200,
        },
      };

      expect(service.countForDate(DATE)).resolves.toEqual(expectedResult);
    });
  });

  describe('cumulativeForDate', () => {
    it('should be defined', async () => {
      expect(service.cumulativeForDate).toBeDefined();
    });

    it('should call the query chain', async () => {
      await service.cumulativeForDate(DATE);
      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should return results grouped by location for a given date', () => {
      const expectedResult: LocationVariantsRecord = {
        Brazil: {
          Delta: 150,
          Omicron: 500,
        },
        Italy: {
          Omicron: 200,
        },
      };

      expect(service.cumulativeForDate(DATE)).resolves.toEqual(expectedResult);
    });
  });
});
