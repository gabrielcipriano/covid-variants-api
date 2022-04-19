import { Controller, Get, Param } from '@nestjs/common';
import { CovidCasesService } from './covid-cases.service';
import { ParseDateStringPipe } from './pipes/parse-date-string.pipe';
import { ValidDateStr } from './types/valid-date-str.type';

@Controller('covid-cases')
export class CovidCasesController {
  constructor(private covidCasesService: CovidCasesService) {}

  @Get(':date')
  count(@Param('date', ParseDateStringPipe) date: ValidDateStr) {
    return this.covidCasesService.countForDate(date);
  }

  @Get(':date')
  cumulative(@Param('date', ParseDateStringPipe) date: ValidDateStr) {
    return this.covidCasesService.cumulativeForDate(date);
  }
}
