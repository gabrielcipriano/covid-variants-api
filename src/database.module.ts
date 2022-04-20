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
              type: configService.get('TYPEORM_CONNECTION') as any,
              host: configService.get<string>('TYPEORM_HOST'),
              port: parseInt(configService.get<string>('TYPEORM_PORT')),
              username: configService.get<string>('TYPEORM_USERNAME'),
              password: configService.get<string>('TYPEORM_PASSWORD'),
              database: configService.get<string>('TYPEORM_DATABASE'),
              entities: [CovidCase],
              synchronize: false,
              cache: true,
              migrations: ['migration/*.js'],
              cli: {
                migrationsDir: 'migration',
              },
            },
    }),
  ],
})
export class DatabaseModule {}
