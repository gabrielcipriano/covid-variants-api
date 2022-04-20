import * as csv from '@fast-csv/parse';

// get only:
// 0: location - this is the country for which the variants information is provided;
// 1: date - date for the data entry;
// 2: variant - this is the variant corresponding to this data entry;
// 3: num_sequences - the number of sequences processed (for the country, variant and date);
// and only entries that num_sequences > 0
export function rowParser(rowObj: any): any | null {
  const { perc_sequences, num_sequences_total, ...obj } = rowObj;
  obj.num_sequences = parseInt(obj.num_sequences);
  return obj.num_sequences !== 0 ? obj : null;
}

export function readCsv(path, options, rowParser): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const data = [];

    csv
      .parseFile(path, options)
      .on('error', reject)
      .on('data', (obj) => {
        const target = rowParser(obj);
        if (target) data.push(target);
      })
      .on('end', (rowCount: number) => {
        console.log(`PARSED ${rowCount} CSV ROWS. `);
        resolve(data);
      });
  });
}
