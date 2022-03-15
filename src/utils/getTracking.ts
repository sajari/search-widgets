import { isEmpty, isString } from '@sajari/react-sdk-utils';
import { ClickTracking, EventTracking, PosNegTracking } from '@sajari/react-search-ui';

import { SearchInputBindingProps, SearchInputProps, TrackingType } from '../types';

export function getTracking(
  props: Omit<SearchInputBindingProps, 'selector' | 'omittedElementSelectors' | 'mode'> | SearchInputProps,
) {
  const { preset, fields, tracking, searchIOAnalyticsEndpoint } = props;

  if (preset === 'shopify') {
    return new PosNegTracking('id');
  }

  if (preset === 'app' && fields?.url && typeof fields.url === 'string') {
    return new ClickTracking(fields.url);
  }

  if (preset === 'website') {
    return new ClickTracking();
  }

  // Parse tracking type
  if (!isEmpty(tracking)) {
    const parseTracking = (type: TrackingType, field?: string) => {
      switch (type) {
        case 'click':
          return new ClickTracking(field);

        case 'posneg':
          return new PosNegTracking(field);

        case 'event':
          return new EventTracking(field, undefined, searchIOAnalyticsEndpoint);

        default:
          return undefined;
      }
    };

    if (isString(tracking)) {
      return parseTracking(tracking);
    }

    const { type, field } = tracking;
    return parseTracking(type, field);
  }

  return undefined;
}
