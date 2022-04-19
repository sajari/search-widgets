import { EventTracking, Pipeline, Tracking } from '@sajari/react-hooks';
import { isNullOrUndefined } from '@sajari/react-sdk-utils';
import { useEffect } from 'react';

import { TrackingProps } from './types';

function isEventTracking(t: Tracking): t is EventTracking {
  return t instanceof EventTracking && 'searchIOAnalytics' in t;
}

function attachEventsHandler(events: TrackingProps['events'], tracking: Tracking) {
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
}

export default (props: TrackingProps) => {
  const { events, id, account, pipeline: pipelineProp, collection, tracking: trackingProps } = props;
  const pipeline = new Pipeline({ collection, account }, pipelineProp, trackingProps ?? new EventTracking(id));
  const tracking = pipeline.getTracking();

  useEffect(() => {
    attachEventsHandler(events, tracking);
  }, []);

  return null;
};
