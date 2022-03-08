/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseURL } from '../url';

test.each([
  ['3434d', 'http://3434d/'],
  ['a', 'http://a/'],
  ['google.com', 'http://google.com/'],
])('parseURL($s)', (input, expected) => {
  expect(parseURL(input)?.toString()).toBe(String(expected));
});
