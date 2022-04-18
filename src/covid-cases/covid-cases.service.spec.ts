import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CovidCase } from './covid-cases.entity';
import { CovidCasesRepository } from './covid-cases.repository';
import { CovidCasesService } from './covid-cases.service';
import { LocationVariantsDto } from './dtos/location-variants.dto';
import { VariantSequencesDto } from './dtos/variant-sequences.dto';
import { ValidDateStr } from './types/valid-date-str.type';

const DATE = '2022-04-02' as ValidDateStr;

const VARIANT1 = new VariantSequencesDto('Alpha', 100);

const LOCATION1 = new LocationVariantsDto('Brazil', DATE);
LOCATION1.variants.push(VARIANT1);

const location1_cumulated = {
  ...LOCATION1,
  variants: [
    new VariantSequencesDto(VARIANT1.variant, VARIANT1.num_sequences + 50),
  ],
};

describe('CovidCasesService', () => {
  let service: CovidCasesService;
  let repo: CovidCasesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CovidCasesService,
        {
          provide: getRepositoryToken(CovidCase),
          useValue: {
            countForDate: jest.fn().mockResolvedValue([LOCATION1]),
            cumulativeForDate: jest
              .fn()
              .mockResolvedValue([location1_cumulated]),
          },
        },
      ],
    }).compile();

    service = module.get<CovidCasesService>(CovidCasesService);
    repo = module.get<CovidCasesRepository>(getRepositoryToken(CovidCase));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the repository', () => {
    service.countForDate(DATE);
    expect(repo.countForDate).toHaveBeenCalled();
  });

  describe('countForDate', () => {
    it('should be defined', () => {
      expect(service.countForDate).toBeDefined();
    });

    it('should call the repository', () => {
      service.countForDate(DATE);
      expect(repo.countForDate).toHaveBeenCalled();
    });

    it('should return a list of results for a given date', () => {
      const date = DATE;
      expect(service.countForDate(date)).resolves.toEqual([LOCATION1]);
    });
  });

  describe('cumulativetForDate', () => {
    it('should be defined', () => {
      expect(service.cumulativeForDate).toBeDefined();
    });

    it('should call the repository', () => {
      service.cumulativeForDate(DATE);
      expect(repo.cumulativeForDate).toHaveBeenCalled();
    });

    it('should return a list of results for a given date', () => {
      const date = DATE;
      expect(service.cumulativeForDate(date)).resolves.toEqual([
        location1_cumulated,
      ]);
    });
  });
});
