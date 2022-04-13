import { EventTracking, Pipeline, Tracking, useTracking, Variables } from '@sajari/react-hooks';
import { isNullOrUndefined } from '@sajari/react-sdk-utils';
import { Results, SearchProvider } from '@sajari/react-search-ui';
import { useEffect, useMemo } from 'react';

import { TrackingProps } from './types';
import { getPipelineInfo } from './utils';

function isEventTracking(t: Tracking): t is EventTracking {
  return t instanceof EventTracking && 'searchIOAnalytics' in t;
}

function TrackingWidget({ events }: { events: TrackingProps['events'] }) {
  const { tracking } = useTracking();

  useEffect(() => {
    if (isEventTracking(tracking)) {
      events.forEach((e) => {
        if (e.event === 'load') {
          const { event, id, data } = e.metadata;
          tracking.searchIOAnalytics.track(event, id, data);
        } else if (!isNullOrUndefined(e.selector)) {
          document.body.addEventListener(e.event, (nativeEvent) => {
            const element = nativeEvent.target as Element;
            if (element.matches(e.selector as string)) {
              const { event, id, data } = e.metadata;
              tracking.searchIOAnalytics.track(event, id, data);
            }
          });
        }
      });
    }
  }, []);

  return null;
}

export default (props: TrackingProps) => {
  const searchContext = useMemo(() => {
    const { id, account, collection, pipeline } = props;
    const { name, version = undefined } = getPipelineInfo(pipeline);
    const variables = new Variables();

    return {
      pipeline: new Pipeline(
        {
          account,
          collection,
        },
        { name, version },
        new EventTracking(id),
      ),
      variables,
    };
  }, []);

  const { events } = props;

  return (
    <SearchProvider searchOnLoad search={searchContext}>
      <Results />
      <TrackingWidget events={events} />
    </SearchProvider>
  );
};
