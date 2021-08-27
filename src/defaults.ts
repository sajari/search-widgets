import { ClickTracking, FieldDictionary, PosNegTracking } from '@sajari/react-hooks';
import { isArray, isEmpty, isNumber, isString, merge, MergeOptions } from '@sajari/react-sdk-utils';

import { SearchResultsOptions, SearchResultsProps, TrackingType, WidgetType } from './types';
import { ShopifySchema } from './types/shopify';
import { mapAspectRatio } from './utils';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface MergePropsParams extends SearchResultsProps {
  id: string;
}

interface MergedSearchResultsProps extends Omit<SearchResultsProps, 'options' | 'tracking' | 'preset'> {
  options: SearchResultsOptions;
  tracking?: ClickTracking | PosNegTracking;
}

export function mergeProps(params: MergePropsParams): MergedSearchResultsProps {
  const { preset, options, fields, id, tracking, ...rest } = params;
  const mergeOptions = new MergeOptions({ arrayHandling: 'replace' });
  const props: MergedSearchResultsProps = {
    ...rest,
    options: {
      input: {
        mode: 'instant',
        position: 'aside',
      },
      results: {
        showStatus: true,
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
        scrollTarget: `#${id}`,
      },
      syncURL: 'push',
      urlParams: {
        q: 'q',
      },
      mode: 'standard',
    },
  };

  switch (preset) {
    case 'shopify': {
      const getVariantImages = (values: ShopifySchema) => {
        return values.variant_ids?.map((_: string, i: number) => {
          const variantImageId = values.variant_image_ids?.[i];
          const variantImageIndex = values.image_ids?.findIndex((ii: string) => ii === variantImageId);
          const variantImageUrl = values.image_urls?.[variantImageIndex ?? -1];

          return variantImageUrl;
        });
      };
      const src: DeepPartial<MergedSearchResultsProps> = {
        tracking: new ClickTracking('id'),
        fields: {
          // eslint-disable-next-line no-template-curly-in-string
          url: '/products/${handle}',
          subtitle: 'vendor',
          description: 'body_html',
          quantity: 'inventory_quantity',
          image: (values: ShopifySchema) => {
            const images = values.image_urls ?? values.images;
            // If there are no variant images to show
            if (!values.variant_image_ids) {
              // Just return the list of images
              return images;
            }

            // Get the variant image urls
            const variantImages = getVariantImages(values);
            const filteredVariantImages = (variantImages ?? []).filter(Boolean);
            const variantPrices = values.variant_prices;

            // If everything matches a.k.a variant image with the corresponding price
            if (filteredVariantImages.length > 0 && filteredVariantImages.length === variantPrices.length) {
              return [images[0], ...filteredVariantImages];
            }

            return images;
          },
          price: (values: ShopifySchema) => {
            const prices = values.variant_prices ?? values.max_price;

            if (!values.variant_image_ids) {
              return prices;
            }

            // Get the variant image urls
            const variantImages = getVariantImages(values);
            const filteredVariantImages = (variantImages ?? []).filter(Boolean);
            const variantPrices = values.variant_prices;

            // If everything matches a.k.a variant image with the corresponding price
            if (filteredVariantImages.length > 0 && filteredVariantImages.length === variantPrices.length) {
              return [prices, ...prices];
            }

            // Otherwise return the array with the first one being an array because
            // the first one in the image urls is not an variant image
            return prices;
          },
          originalPrice: 'variant_compare_at_prices',
        },
        options: {
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
        },
        importantStyles: true,
      };

      merge(mergeOptions, props, src);
      break;
    }

    case 'app': {
      const src: DeepPartial<MergedSearchResultsProps> = {
        options: {
          syncURL: 'push',
        },
      };

      if (fields?.url && typeof fields.url === 'string') {
        src.tracking = new ClickTracking(fields.url);
      }

      merge(mergeOptions, props, src);
      break;
    }

    case 'website': {
      const src: DeepPartial<MergedSearchResultsProps> = {
        tracking: new ClickTracking(),
        options: {
          syncURL: 'push',
        },
      };

      merge(mergeOptions, props, src);
      break;
    }
    default: {
      break;
    }
  }

  // Merge fields, if specified
  if (!isEmpty(fields)) {
    merge(mergeOptions, props, { fields });
  }

  // Merge options, if specified
  if (!isEmpty(options)) {
    merge(mergeOptions, props, { options });
  }

  // Parse aspect ratios
  if (options?.results?.imageAspectRatio) {
    const defaultRatio = props.options?.results?.imageAspectRatio;
    const defaultRatios = isNumber(defaultRatio) ? { list: defaultRatio, grid: defaultRatio } : defaultRatio;
    const newRatio = options.results.imageAspectRatio;
    const newRatios = isNumber(newRatio) ? { list: newRatio, grid: newRatio } : newRatio;

    Object.assign(props.options.results, {
      imageAspectRatio: mapAspectRatio({
        ...defaultRatios,
        ...newRatios,
      }),
    });
  }

  // Inject "Most relevant" option if required
  if (
    props.options.sorting?.options &&
    props.options.sorting.options.length > 0 &&
    !props.options.sorting.options.some(({ value }) => isEmpty(value))
  ) {
    if (!props.options.sorting) {
      props.options.sorting = {};
    }

    if (!isArray(props.options.sorting.options)) {
      props.options.sorting.options = [];
    }

    props.options.sorting.options.unshift({
      name: 'Most relevant',
      value: '',
    });
  }

  // Parse fields as a FieldDictionary
  props.fields = new FieldDictionary(props.fields);

  // Parse tracking type
  if (!isEmpty(tracking)) {
    const parseTracking = (type: TrackingType, field?: string) => {
      switch (type) {
        case 'click':
          return new ClickTracking(field);

        case 'posneg':
          return new PosNegTracking(field);

        default:
          return undefined;
      }
    };

    if (isString(tracking)) {
      props.tracking = parseTracking(tracking);
    } else if (tracking) {
      const { type, field } = tracking;
      props.tracking = parseTracking(type, field);
    }
  }

  return props;
}

export const getPresetSelector = (preset: SearchResultsProps['preset']) => {
  switch (preset) {
    case 'shopify':
      return 'form[action="/search"] input[name="q"]';
    default:
      return '';
  }
};

export const getPresetSelectorOverlayMode = (preset: SearchResultsProps['preset']) => {
  switch (preset) {
    case 'shopify':
      return ['form[action="/search"]', 'a[href="/search"]'];
    default:
      return [];
  }
};

const defaultConfig = {
  account: '1603163345448404241',
  collection: 'sajari-test-fashion2',
  pipeline: 'query',
  preset: 'shopify',
};

const filters = [
  {
    name: 'vendor',
    field: 'vendor',
    title: 'Vendor',
    searchable: true,
  },
  {
    name: 'type',
    field: 'product_type',
    title: 'Type',
    searchable: true,
  },
  {
    name: 'collection',
    field: 'collection_titles',
    title: 'Collection',
    array: true,
  },
];

export const widgetDefaultContent: Record<WidgetType, string> = {
  'search-results': JSON.stringify({ ...defaultConfig, filters }),
  overlay: JSON.stringify(
    {
      ...defaultConfig,
      filters,
      options: { mode: 'overlay', buttonSelector: '#button', inputSelector: '#search-input' },
    },
    null,
    2,
  ),
  'search-input-binding': JSON.stringify({ ...defaultConfig, selector: "input[name='q']", mode: 'suggestions' }),
  'search-input': JSON.stringify({
    ...defaultConfig,
    mode: 'suggestions',
    redirect: { url: 'search', queryParamName: 'q' },
  }),
};
