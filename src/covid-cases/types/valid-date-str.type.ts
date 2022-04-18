// TYPE SAFETY FOR DATE STRINGS

import { Brand } from './brand.type';

export type ValidDateStr = string & Brand<'ValidDateStr'>;

// 'YYYY-MM-DD'
function checkValidDateStr(str: string): str is ValidDateStr {
  const bits = str.split('-').map(Number);
  const dt = new Date(bits[0], bits[1] - 1, bits[2]);
  return dt && dt.getMonth() + 1 === bits[1] && dt.getDate() === bits[2];
}

export function toValidDateStr(date: Date | string): ValidDateStr {
  if (typeof date === 'string') {
    if (checkValidDateStr(date)) return date;
  } else if (date instanceof Date && !isNaN(date as any)) {
    const iso = date.toISOString();
    const dateStr = iso.substring(0, iso.indexOf('T'));
    if (checkValidDateStr(dateStr)) return dateStr;
  }
  throw new Error(`Invalid date string: ${date}`);
}
