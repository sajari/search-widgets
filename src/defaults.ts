import { FieldDictionary } from '@sajari/react-hooks';
import { isObject, merge } from 'lodash-es';

import { AppOptions, Preset } from './types';
import { mapAspectRatio } from './utils';

export function getDefaultFields(preset: Preset): FieldDictionary {
  switch (preset) {
    case 'shopify':
      return {
        // eslint-disable-next-line no-template-curly-in-string
        url: '/products/${handle}',
        subtitle: 'vendor',
        description: 'body_html',
        image: ['image_urls', 'images'],
        price: ['variant_prices', 'max_price'],
        originalPrice: 'variant_compare_at_prices',
      };

    default:
      return {};
  }
}

export function getDefaultOptions(preset: Preset): AppOptions {
  const defaults: AppOptions = {
    input: {
      mode: 'instant',
    },
    results: {
      imageAspectRatio: {
        grid: 1,
        list: 1,
      },
      imageObjectFit: {
        grid: 'cover',
        list: 'contain',
      },
    },
    resultsPerPage: {
      options: [15, 25, 50, 100],
    },
    pagination: {
      scrollToTop: true,
    },
    syncURL: 'none',
    urlParams: {
      q: 'q',
    },
  };

  switch (preset) {
    case 'shopify':
      return merge(defaults, {
        results: {
          imageAspectRatio: {
            grid: 9 / 16,
            list: 1,
          },
          imageObjectFit: {
            grid: 'cover',
            list: 'cover',
          },
          viewType: 'grid',
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
        syncURL: 'push',
      });

    default:
      return defaults;
  }
}

export function mergeDefaults(id: string, preset: Preset, options?: AppOptions): AppOptions {
  const defaultOptions = getDefaultOptions(preset);

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
