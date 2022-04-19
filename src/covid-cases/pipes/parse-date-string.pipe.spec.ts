import { ValidDateStr } from '../types/valid-date-str.type';
import { BadRequestException } from '@nestjs/common';
import { ParseDateStringPipe } from './parse-date-string.pipe';

const goodTestValue = '2022-04-02';
const badTestStringValue = 'not a date string';
const badTestAnyOtherValue = 2022;
const badTestOutOfRangeValue = '2022-99-02';

const failString = 'should throw an error for incorrect type';

describe('ParseDateStringPipe', () => {
  let pipe: ParseDateStringPipe;

  beforeEach(() => {
    pipe = new ParseDateStringPipe();
  });
  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
  describe('successful call', () => {
    it('should let the ValidDateStr go on through', () => {
      const potentialDate = goodTestValue;
      expect(pipe.transform(potentialDate)).toEqual(
        goodTestValue as ValidDateStr,
      );
    });
  });
  describe('unsuccessful calls', () => {
    describe('value type error: not a string', () => {
      it(failString, () => {
        const badPotentialDate = badTestAnyOtherValue;
        const errorPipe = () => pipe.transform(badPotentialDate);
        expect(errorPipe).toThrowError(BadRequestException);
        expect(errorPipe).toThrowError(pipe.errorString + 'Must be a string.');
      });
      it(failString, () => {
        const badPotentialDate = ['not', 'a', 'string', 'date'];
        const errorPipe = () => pipe.transform(badPotentialDate);
        expect(errorPipe).toThrowError(BadRequestException);
        expect(errorPipe).toThrowError(pipe.errorString + 'Must be a string.');
      });
    });
    describe('value type error: Invalid string format', () => {
      it(failString, () => {
        const badPotentialDate = badTestStringValue;
        const errorPipe = () => pipe.transform(badPotentialDate);
        expect(errorPipe).toThrowError(BadRequestException);
        expect(errorPipe).toThrowError(
          pipe.errorString + `Invalid date string: ${badPotentialDate}`,
        );
      });
    });
    describe('value type error: Date out of range', () => {
      it(failString, () => {
        const badPotentialDate = badTestOutOfRangeValue;
        const errorPipe = () => pipe.transform(badPotentialDate);
        expect(errorPipe).toThrowError(BadRequestException);
        expect(errorPipe).toThrowError(
          pipe.errorString + `Invalid date string: ${badPotentialDate}`,
        );
      });
    });
  });
});
