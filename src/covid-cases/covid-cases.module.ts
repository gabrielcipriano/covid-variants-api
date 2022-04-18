import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CovidCasesController } from './covid-cases.controller';
import { CovidCasesRepository } from './covid-cases.repository';
import { CovidCasesService } from './covid-cases.service';

@Module({
  imports: [TypeOrmModule.forFeature([CovidCasesRepository])],
  controllers: [CovidCasesController],
  providers: [CovidCasesService],
})
export class CovidCasesModule {}
