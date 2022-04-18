import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { CovidCasesModule } from './covid-cases/covid-cases.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CovidCasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
