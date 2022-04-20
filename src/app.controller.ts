import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('covid-cases')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Backend Challenge 2021 🏅 - Covid Daily Cases',
  })
  @ApiResponse({
    status: 200,
    description: 'A successful call.',
    schema: {
      type: 'string',
      example: 'Backend Challenge 2021 🏅 - Covid Daily Cases',
    },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
