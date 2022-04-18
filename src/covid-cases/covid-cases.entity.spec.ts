import { CovidCase } from './covid-cases.entity';

describe('CovidCase entity', () => {
  it('Should make a CovidCase with all fields', async () => {
    const covidCase = new CovidCase('Brazil', '2022-04-02', 'Delta', 100);

    expect(covidCase).toBeTruthy();
    expect(covidCase.location).toBe('Brazil');
    expect(covidCase.date).toBe('2022-04-02');
    expect(covidCase.variant).toBe('Delta');
    expect(covidCase.num_sequences).toBe(100);
  });
});
