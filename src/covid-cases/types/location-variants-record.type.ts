import { VariantCasesRecord } from './variant-cases-record.type';
import { ApiProperty } from '@nestjs/swagger';

/*
  We will have something like this:
    {
      'brazil':{
        'omicron': 200,
        'delta': 100,
      },
      'italy':{
        'omicron': 100,
        'alpha': 50,
      }
    }
*/
export type LocationVariantsRecord = Record<string, VariantCasesRecord>;
