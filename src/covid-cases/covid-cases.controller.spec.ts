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
            allDates: jest
              .fn()
              .mockImplementation(async (): Promise<string[]> => {
                return ['2022-04-02', '2021-03-01'];
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<CovidCasesController>(CovidCasesController);
    service = module.get<CovidCasesService>(CovidCasesService);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should call the service', async () => {
    const date = DATE;
    controller.count(date);
    expect(service.countForDate).toHaveBeenCalled();
  });

  describe('count', () => {
    it('should be defined', async () => {
      expect(controller.count).toBeDefined();
    });

    it('should call the service', async () => {
      const date = DATE;
      controller.count(date);
      expect(service.countForDate).toHaveBeenCalled();
    });

    it('should return an record for a given date', async () => {
      const date = DATE;
      expect(controller.count(date)).resolves.toEqual(locationRecord);
    });
  });

  describe('cumulative', () => {
    it('should be defined', async () => {
      expect(controller.cumulative).toBeDefined();
    });

    it('should call the service', async () => {
      const date = DATE;
      controller.cumulative(date);
      expect(service.cumulativeForDate).toHaveBeenCalled();
    });

    it('should return an record with proper cumulated value for a given date', async () => {
      const date = DATE;

      expect(controller.cumulative(date)).resolves.toEqual({
        ...locationRecord,
        Italy: { Omicron: 400, Delta: 300 },
      });
    });
  });

  describe('getDates', () => {
    it('should be defined', async () => {
      expect(controller.getDates).toBeDefined();
    });

    it('should call the service', async () => {
      controller.getDates();
      expect(service.allDates).toHaveBeenCalled();
    });

    it('should return the distinct dates available', async () => {
      expect(controller.getDates()).resolves.toEqual([
        '2022-04-02',
        '2021-03-01',
      ]);
    });
  });
});
