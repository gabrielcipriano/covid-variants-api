import { Controller, Get, Param } from '@nestjs/common';
import { CovidCasesService } from './covid-cases.service';
import { toValidDateStr } from './types/valid-date-str.type';

@Controller('covid-cases')
export class CovidCasesController {
  constructor(private covidCasesService: CovidCasesService) {}

  @Get(':date')
  count(@Param('date') date: string) {
    const dateStr = toValidDateStr(date);
    return this.covidCasesService.countForDate(dateStr);
  }

  @Get(':date')
  cumulative(@Param('date') date: string) {
    const dateStr = toValidDateStr(date);
    return this.covidCasesService.cumulativeForDate(dateStr);
  }
}
