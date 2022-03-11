import { ClickTracking, EventTracking, PosNegTracking, Variables } from '@sajari/react-hooks';
import { Client } from '@sajari/sdk-js';

import { getTracking } from './getTracking';

const defaultProps = {
  account: 'my-account',
  collection: 'my-collection',
  config: {
    fieldsParam: 'fields',
    maxSuggestions: 10,
    pageParam: 'page',
    qOverrideParam: 'q.override',
    qParam: 'q',
    qSuggestionsParam: 'q.suggestions',
    resultsPerPageParam: 'resultsPerPage',
  },
  defaultFilter: '',
  mode: 'standard',
  pipeline: 'my-pipeline',
  preset: undefined,
  variables: new Variables(),
  theme: {},
};

describe('getTracking', () => {
  it('is undefined if preset is undefined', () => {
    expect(getTracking({ ...defaultProps })).toBeUndefined();
  });

  it('is PosNegTracking if preset is shopify', () => {
    expect(getTracking({ ...defaultProps, preset: 'shopify' })).toBeInstanceOf(PosNegTracking);
  });

  it('is ClickTracking if preset is app and a url field is supplied', () => {
    expect(getTracking({ ...defaultProps, preset: 'app', fields: { url: '/abc' } })).toBeInstanceOf(ClickTracking);
  });

  it('is ClickTracking if preset is website', () => {
    expect(getTracking({ ...defaultProps, preset: 'website' })).toBeInstanceOf(ClickTracking);
  });

  it('is ClickTracking if tracking is click', () => {
    expect(getTracking({ ...defaultProps, tracking: 'click' })).toBeInstanceOf(ClickTracking);
    expect(getTracking({ ...defaultProps, tracking: { type: 'click', field: 'id' } })).toBeInstanceOf(ClickTracking);
  });

  it('is PosNegTracking if tracking is posneg', () => {
    expect(getTracking({ ...defaultProps, tracking: 'posneg' })).toBeInstanceOf(PosNegTracking);
    expect(getTracking({ ...defaultProps, tracking: { type: 'posneg', field: 'id' } })).toBeInstanceOf(PosNegTracking);
  });

  it('is EventTracking if tracking is event', () => {
    expect(getTracking({ ...defaultProps, tracking: 'event' })).toBeInstanceOf(EventTracking);
    expect(getTracking({ ...defaultProps, tracking: { type: 'event', field: 'id' } })).toBeInstanceOf(EventTracking);
  });

  it('passes a custom searchIOAnalyticsEndpoint if supplied', () => {
    const searchIOAnalyticsEndpoint = 'http://example.com';
    const tracking = getTracking({
      ...defaultProps,
      tracking: 'event',
      searchIOAnalyticsEndpoint,
    }) as EventTracking;
    tracking.bootstrap(new Client(defaultProps.account, defaultProps.collection), jest.fn());

    expect(tracking.searchIOAnalytics.endpoint).toBe(searchIOAnalyticsEndpoint);
  });
});
