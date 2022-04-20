import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CovidCase } from './covid-cases/covid-cases.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<string>('APPLICATION_ENV') === 'test'
          ? {
              type: 'sqlite',
              database: ':memory:',
              entities: [CovidCase],
              synchronize: true,
              cache: true,
            }
          : {
              type: 'postgres',
              host: configService.get<string>('DATABASE_HOST'),
              port: parseInt(configService.get<string>('DATABASE_PORT')),
              username: configService.get<string>('DATABASE_USERNAME'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('DATABASE_NAME'),
              entities: [CovidCase],
              synchronize: true,
              cache: true,
            },
    }),
  ],
})
export class DatabaseModule {}
