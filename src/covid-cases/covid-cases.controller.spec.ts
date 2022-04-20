import { Test, TestingModule } from '@nestjs/testing';
import { CovidCasesController } from './covid-cases.controller';
import { CovidCasesService } from './covid-cases.service';
import { LocationVariantsRecord } from './types/location-variants-record.type';
import { ValidDateStr } from './types/valid-date-str.type';

const DATE = '2022-04-02' as ValidDateStr;

const locationRecord: LocationVariantsRecord = {
  Brazil: {
    Alpha: 100,
  },
};

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
                async (date: ValidDateStr): Promise<LocationVariantsRecord> => {
                  return locationRecord;
                },
              ),
            cumulativeForDate: jest
              .fn()
              .mockImplementation(
                async (date: ValidDateStr): Promise<LocationVariantsRecord> => {
                  return {
                    ...locationRecord,
                    Italy: { Omicron: 400, Delta: 300 },
                  };
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

    it('should return an record for a given date', () => {
      const date = DATE;
      expect(controller.count(date)).resolves.toEqual(locationRecord);
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

    it('should return an record with proper cumulated value for a given date', () => {
      const date = DATE;

      expect(controller.cumulative(date)).resolves.toEqual({
        ...locationRecord,
        Italy: { Omicron: 400, Delta: 300 },
      });
    });
  });
});
