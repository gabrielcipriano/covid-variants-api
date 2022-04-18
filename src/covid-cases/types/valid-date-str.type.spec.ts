import { toValidDateStr, ValidDateStr } from './valid-date-str.type';

describe('ValidDateStr type', () => {
  it("Should make sure a date string in format 'YYYY-MM-DD' is valid.", () => {
    const entryString = '2022-04-02';
    const dateString: ValidDateStr = toValidDateStr(entryString);

    expect(dateString).toEqual('2022-04-02');
  });

  it('Should throw an error if a day is out of range.', () => {
    const entryString = '2022-44-02';
    expect(() => toValidDateStr(entryString)).toThrowError(
      `Invalid date string: ${entryString}`,
    );
  });

  it('Should throw an error if a month is out of range.', () => {
    const entryString = '2022-10-33';
    expect(() => toValidDateStr(entryString)).toThrowError(
      `Invalid date string: ${entryString}`,
    );
  });

  it('Should throw an error if string haves a invalid format.', () => {
    const entryString = 'invalid string date';
    expect(() => toValidDateStr(entryString)).toThrowError();
  });

  it("Should parse a valid Date object to a date string in format 'YYYY-MM-DD'.", () => {
    const entryDate = new Date('2022-04-02');
    const dateString: ValidDateStr = toValidDateStr(entryDate);

    expect(dateString).toEqual('2022-04-02');
  });

  it('Should throw an error if an invalid Date object is given.', () => {
    const entryDate = new Date('invalid date string');
    expect(() => toValidDateStr(entryDate)).toThrowError(
      `Invalid date string: ${entryDate}`,
    );
  });
});
