import { Controller, Get, Param } from '@nestjs/common';
import { CovidCasesService } from './covid-cases.service';
import { ParseDateStringPipe } from './pipes/parse-date-string.pipe';
import { ValidDateStr } from './types/valid-date-str.type';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { successfulRecordsCallSchema } from './schemas/succesfull-records-call.schema';

@ApiTags('covid-cases')
@Controller()
export class CovidCasesController {
  constructor(private covidCasesService: CovidCasesService) {}

  @ApiOperation({
    summary:
      'Return all records in the database on the selected day, grouped by country and separated by variant.',
    description: "date parameter should be in 'YYYY-MM-DD' string format",
  })
  @ApiResponse({
    status: 200,
    description: 'A successful call.',
    schema: successfulRecordsCallSchema,
  })
  @Get('/count/:date')
  count(@Param('date', ParseDateStringPipe) date: ValidDateStr) {
    return this.covidCasesService.countForDate(date);
  }
  @ApiOperation({
    summary:
      'Return all records in the database, returning the sum of registered cases according to the selected date, grouped by country and separated by variant.',
    description: "date parameter should be in 'YYYY-MM-DD' string format",
  })
  @ApiResponse({
    status: 200,
    description: 'A successful call.',
    schema: successfulRecordsCallSchema,
  })
  @Get('/cumulative/:date')
  cumulative(@Param('date', ParseDateStringPipe) date: ValidDateStr) {
    return this.covidCasesService.cumulativeForDate(date);
  }

  @ApiOperation({
    summary: 'List available dates in the dataset.',
  })
  @ApiResponse({
    status: 200,
    description: 'A successful call.',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: ['2022-04-02', '2020-11-20'],
    },
  })
  @Get('/dates')
  getDates() {
    return this.covidCasesService.allDates();
  }
}
