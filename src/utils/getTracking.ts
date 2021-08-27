import { ClickTracking, PosNegTracking } from '@sajari/react-hooks';
import { isEmpty, isString } from '@sajari/react-sdk-utils';

import { SearchInputBindingProps, SearchInputProps, TrackingType } from '../types';

export function getTracking(
  props: Omit<SearchInputBindingProps, 'selector' | 'omittedElementSelectors' | 'mode'> | SearchInputProps,
) {
  const { preset, fields, tracking } = props;

  if (preset === 'shopify') {
    return new ClickTracking('id');
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
