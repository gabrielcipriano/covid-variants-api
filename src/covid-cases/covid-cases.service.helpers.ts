import { CovidCase } from './covid-cases.entity';
import { LocationVariantsRecord } from './types/location-variants-record.type';

export function groupResultsByLocation(
  queryResult: CovidCase[],
): LocationVariantsRecord {
  return queryResult.reduce((record: LocationVariantsRecord, currentRow) => {
    const { location, variant, num_sequences } = currentRow;

    if (!record[location]) record[location] = {};

    record[location][variant] = parseInt(num_sequences as any);

    return record;
  }, {});
}
