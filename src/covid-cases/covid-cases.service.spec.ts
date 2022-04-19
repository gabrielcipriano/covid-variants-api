import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CovidCase } from './covid-cases.entity';
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
  let repo: Repository<CovidCase>;
  let spy_querybuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports:[getRepositoryToken(CovidCase)]
      providers: [
        CovidCasesService,
        {
          provide: getRepositoryToken(CovidCase),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CovidCasesService>(CovidCasesService);
    repo = module.get<Repository<CovidCase>>(getRepositoryToken(CovidCase));
    spy_querybuilder = jest.spyOn(repo, 'createQueryBuilder');
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should call the repository', async () => {
    const createQueryBuilder: any = () => ({
      where: createQueryBuilder,
      getMany: createQueryBuilder,
    });

    spy_querybuilder.mockImplementation(createQueryBuilder);

    await service.countForDate(DATE);
    expect(repo.createQueryBuilder).toHaveBeenCalled();
  });

  describe('countForDate', () => {
    it('should be defined', async () => {
      expect(service.countForDate).toBeDefined();
    });

    it('should call the query chain', async () => {
      const createQueryBuilder: any = () => ({
        where: createQueryBuilder,
        getMany: createQueryBuilder,
      });

      spy_querybuilder.mockImplementation(createQueryBuilder);

      service.countForDate(DATE);
      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should return a list of results for a given date', () => {
      const createQueryBuilder: any = () => ({
        where: createQueryBuilder,
        getMany: () => [LOCATION1],
      });

      spy_querybuilder.mockImplementation(createQueryBuilder);

      expect(service.countForDate(DATE)).resolves.toEqual([LOCATION1]);
    });
  });

  describe('cumulativeForDate', () => {
    it('should be defined', async () => {
      expect(service.cumulativeForDate).toBeDefined();
    });

    it('should call the query chain', async () => {
      const createQueryBuilder: any = () => ({
        where: createQueryBuilder,
        getMany: createQueryBuilder,
      });

      spy_querybuilder.mockImplementation(createQueryBuilder);

      service.cumulativeForDate(DATE);
      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should return a list of results for a given date', () => {
      const createQueryBuilder: any = () => ({
        where: createQueryBuilder,
        getMany: () => {
          const variant = new VariantSequencesDto('Alpha', 100);

          const location = new LocationVariantsDto('Brazil', DATE);
          location.variants.push(variant);
          const accumulated_value = 50;
          location.variants[0].num_sequences += accumulated_value;

          return [location];
        },
      });

      spy_querybuilder.mockImplementation(createQueryBuilder);
      expect(service.cumulativeForDate(DATE)).resolves.toEqual([
        location1_cumulated,
      ]);
    });
  });
});
