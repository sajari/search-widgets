import { Range } from '@sajari/react-hooks';
import { isArray, isNumber } from '@sajari/react-sdk-utils';

export function isRange(value: unknown) {
  return isArray(value) && value.length === 2 && isNumber(value[0]) && isNumber(value[1]);
}

export function rangeToParam(value: Range) {
  return value.join(':');
}

export function paramToRange(value: string) {
  return value.split(':').map(Number);
}
