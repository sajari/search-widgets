import { isObject, merge } from 'lodash-es';

import { AppOptions } from './types';
import { mapAspectRatio } from './utils';

export const defaultFields = {
  // eslint-disable-next-line no-template-curly-in-string
  url: '/products/${handle}',
  subtitle: 'product_type',
  description: 'body_html',
  image: 'image_url',
  price: ['variant_prices', 'max_price'],
};

export const defaultOptions: AppOptions = {
  input: {
    mode: 'instant',
  },
  results: {
    imageAspectRatio: {
      grid: 9 / 16,
      list: 1,
    },
    imageObjectFit: {
      grid: 'cover',
      list: 'contain',
    },
    defaultAppearance: 'grid',
  },
  resultsPerPage: {
    options: [15, 25, 50, 100],
  },
  sorting: {
    options: [
      {
        name: 'Most relevant',
        value: '',
      },
      {
        name: 'Price: Low to High',
        value: 'max_price',
      },
      {
        name: 'Price: High to Low',
        value: '-max_price',
      },
      {
        name: 'Alphabetical: A to Z',
        value: 'title',
      },
      {
        name: 'Alphabetical: Z to A',
        value: '-title',
      },
      {
        name: 'Date: Newest to Oldest',
        value: '-created_at',
      },
      {
        name: 'Date: Oldest to Newest',
        value: 'created_at',
      },
    ],
  },
  pagination: {
    scrollToTop: true,
  },
};

export function mergeDefaults(id: string, options?: AppOptions) {
  Object.assign(defaultOptions.pagination, {
    scrollTarget: `#${id}`,
  });

  if (!isObject(options)) {
    return defaultOptions;
  }

  if (options.results?.imageAspectRatio) {
    Object.assign(options.results, {
      imageAspectRatio: mapAspectRatio(options.results.imageAspectRatio),
    });
  }

  return merge({}, defaultOptions, options);
}
