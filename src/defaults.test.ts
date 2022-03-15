import { ClickTracking, EventTracking, PosNegTracking, Variables } from '@sajari/react-hooks';
import { Client } from '@sajari/sdk-js';
import mitt from 'mitt';

import { mergeProps } from './defaults';

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
  emitter: mitt(),
  id: '',
  mode: 'standard',
  pipeline: 'my-pipeline',
  preset: undefined,
  variables: new Variables(),
  theme: {},
};

describe('mergeProps', () => {
  it('tracking property is ClickTracking if tracking is click', () => {
    expect(mergeProps({ ...defaultProps, tracking: 'click' }).tracking).toBeInstanceOf(ClickTracking);
    expect(mergeProps({ ...defaultProps, tracking: { type: 'click', field: 'id' } }).tracking).toBeInstanceOf(
      ClickTracking,
    );
  });

  it('tracking property is PosNegTracking if tracking is posneg', () => {
    expect(mergeProps({ ...defaultProps, tracking: 'posneg' }).tracking).toBeInstanceOf(PosNegTracking);
    expect(mergeProps({ ...defaultProps, tracking: { type: 'posneg', field: 'id' } }).tracking).toBeInstanceOf(
      PosNegTracking,
    );
  });

  it('tracking property is EventTracking if tracking is event', () => {
    expect(mergeProps({ ...defaultProps, tracking: 'event' }).tracking).toBeInstanceOf(EventTracking);
    expect(mergeProps({ ...defaultProps, tracking: { type: 'event', field: 'id' } }).tracking).toBeInstanceOf(
      EventTracking,
    );
  });

  it('tracking property is passed a custom searchIOAnalyticsEndpoint if supplied', () => {
    const searchIOAnalyticsEndpoint = 'http://example.com';
    const tracking = mergeProps({
      ...defaultProps,
      tracking: 'event',
      searchIOAnalyticsEndpoint,
    }).tracking as EventTracking;
    tracking.bootstrap(new Client(defaultProps.account, defaultProps.collection), jest.fn());

    expect(tracking.searchIOAnalytics.endpoint).toBe(searchIOAnalyticsEndpoint);
  });
});
