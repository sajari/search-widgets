/* eslint-disable @typescript-eslint/no-explicit-any */
import { getComputedStyleForElement, parseBreakpoints, parseRatio } from '../styles';

test.each([
  [
    639,
    {
      sm: false,
      md: false,
      lg: false,
      xl: false,
    },
  ],
  [
    641,
    {
      sm: true,
      md: false,
      lg: false,
      xl: false,
    },
  ],
  [
    800,
    {
      sm: true,
      md: true,
      lg: false,
      xl: false,
    },
  ],
  [
    1025,
    {
      sm: true,
      md: true,
      lg: true,
      xl: false,
    },
  ],
  [
    1281,
    {
      sm: true,
      md: true,
      lg: true,
      xl: true,
    },
  ],
]);

it('getComputedStyleForElement', () => {
  document.head.innerHTML = `
    <style>
      .test-class-1 { color:red; }
      .test-class-2 { border-radius: 8px; }
    </style>
  `;
  document.body.innerHTML = `
    <div lass="test-class-1 test-class-2">Visible Example</div>
  `;

  expect(getComputedStyleForElement('color', 'div', ['test-class-1', 'test-class-2'])).toBe('red');
  expect(getComputedStyleForElement('border-radius', 'div', ['test-class-1', 'test-class-2'])).toBe('8px');
});

test.each([
  ['1:2', 1],
  ['3:1', 3],
  ['4:5', 4],
  ['4/5', 0.8],
  ['9/4', 2.25],
  ['test', NaN],
])('parseRatio($s)', (input, expected) => {
  expect(parseRatio(input)).toStrictEqual(expected);
});
