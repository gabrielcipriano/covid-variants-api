import { Test, TestingModule } from '@nestjs/testing';
import { CovidCasesController } from './covid-cases.controller';
import { CovidCasesService } from './covid-cases.service';
import { LocationVariantsDto } from './dtos/location-variants.dto';
import { VariantSequencesDto } from './dtos/variant-sequences.dto';
import { ValidDateStr } from './types/valid-date-str.type';

const DATE = '2022-04-02' as ValidDateStr;

const VARIANT1 = new VariantSequencesDto('Alpha', 100);
const VARIANT1_ANOTHER = new VariantSequencesDto('Alpha', 50);

const LOCATION1 = new LocationVariantsDto('Brazil', DATE);
LOCATION1.variants.push(VARIANT1);

describe('CovidCasesController', () => {
  let controller: CovidCasesController;
  let service: CovidCasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CovidCasesController],
      providers: [
        {
          provide: CovidCasesService,
          useValue: {
            countForDate: jest
              .fn()
              .mockImplementation(
                async (
                  date: ValidDateStr,
                ): Promise<Array<LocationVariantsDto>> => {
                  return [LOCATION1];
                },
              ),
            cumulativeForDate: jest
              .fn()
              .mockImplementation(
                async (
                  date: ValidDateStr,
                ): Promise<Array<LocationVariantsDto>> => {
                  return [
                    {
                      ...LOCATION1,
                      variants: [
                        {
                          variant: VARIANT1.variant,
                          num_sequences:
                            VARIANT1.num_sequences +
                            VARIANT1_ANOTHER.num_sequences,
                        },
                      ],
                    },
                  ];
                },
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<CovidCasesController>(CovidCasesController);
    service = module.get<CovidCasesService>(CovidCasesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service', () => {
    const date = DATE;
    controller.count(date);
    expect(service.countForDate).toHaveBeenCalled();
  });

  describe('count', () => {
    it('should be defined', () => {
      expect(controller.count).toBeDefined();
    });

    it('should call the service', () => {
      const date = DATE;
      controller.count(date);
      expect(service.countForDate).toHaveBeenCalled();
    });

    it('should return a list of results for a given date', () => {
      const date = DATE;
      expect(controller.count(date)).resolves.toEqual([LOCATION1]);
    });

    it('should throw an error if a invalid date string is provided', () => {
      const date = 'invalid date';
      expect(() => controller.count(date)).toThrowError(
        `Invalid date string: ${date}`,
      );
    });
  });

  describe('cumulative', () => {
    it('should be defined', () => {
      expect(controller.cumulative).toBeDefined();
    });

    it('should call the service', () => {
      const date = DATE;
      controller.cumulative(date);
      expect(service.cumulativeForDate).toHaveBeenCalled();
    });

    it('should return a list of results with proper cumulated value for a given date', () => {
      const date = DATE;
      const location1_cumulated = {
        ...LOCATION1,
        variants: [
          {
            variant: VARIANT1.variant,
            num_sequences:
              VARIANT1.num_sequences + VARIANT1_ANOTHER.num_sequences,
          },
        ],
      };
      expect(controller.cumulative(date)).resolves.toEqual([
        location1_cumulated,
      ]);
    });

    it('should throw an error if a invalid date string is provided', () => {
      const date = 'invalid date';
      expect(() => controller.cumulative(date)).toThrowError(
        `Invalid date string: ${date}`,
      );
    });
  });
});
