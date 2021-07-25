// taken from https://github.com/jesstech/postcss-rem-to-pixel/blob/master/lib/rem-unit-regex.js#L9

// excluding regex trick: http://www.rexegg.com/regex-best-trick.html

// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by rem
// !singlequotes|!doublequotes|!url()|remunit

export const remUnitRegex = /"[^"]+"|'[^']+'|url\([^)]+\)|(\d*\.?\d+)rem/g;
