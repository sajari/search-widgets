import { EventTracking, Pipeline, Tracking, useTracking, Variables } from '@sajari/react-hooks';
import { SearchProvider } from '@sajari/react-search-ui';
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
        } else if (e.selector) {
          document.querySelectorAll(e.selector).forEach((element) => {
            element.addEventListener(e.event, (nativeEvent) => {
              nativeEvent.preventDefault();
              nativeEvent.stopPropagation();

              const { event, id, data } = e.metadata;

              tracking.searchIOAnalytics.track(event, id, data);
            });
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
      {['development', 'test'].includes(process.env.NODE_ENV ?? '') && (
        <article>
          <h3>
            <a href="https://example.com">Ally Ring</a>
          </h3>
        </article>
      )}
      <TrackingWidget events={events} />
    </SearchProvider>
  );
};
