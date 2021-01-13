import { isArray, isNumber } from '@sajari/react-sdk-utils';

export default function isRange(value: unknown) {
  return isArray(value) && value.length === 2 && isNumber(value[0]) && isNumber(value[1]);
}
