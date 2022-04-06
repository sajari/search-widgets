import { EventTracking, Tracking, useTracking } from '@sajari/react-hooks';
import { useEffect } from 'react';

import { TrackingProps } from './types';

function isEventTracking(t: Tracking): t is EventTracking {
  return t instanceof EventTracking && 'searchIOAnalytics' in t;
}

export default ({ events }: TrackingProps) => {
  const { tracking } = useTracking();

  useEffect(() => {
    if (isEventTracking(tracking)) {
      events.forEach((e) => {
        document.querySelector(e.selector)?.addEventListener(e.event, () => {
          const { event, id, data } = e.metadata;

          tracking.searchIOAnalytics.track(event, id, data);
        });
      });
    }
  }, []);

  return null;
};
