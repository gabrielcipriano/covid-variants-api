import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CovidCasesController } from './covid-cases.controller';
import { CovidCase } from './covid-cases.entity';
import { CovidCasesService } from './covid-cases.service';

@Module({
  imports: [TypeOrmModule.forFeature([CovidCase])],
  controllers: [CovidCasesController],
  providers: [CovidCasesService],
})
export class CovidCasesModule {}
