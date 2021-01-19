import { Handler } from 'mitt';

import { usePubSub as useInternalPubSub } from '../../pubsub/context';
import { PubSubEvents } from './types';

export function usePubSub() {
  const { emitter } = useInternalPubSub();

  function sub<T extends Handler>(event: PubSubEvents, handler: T) {
    emitter.on(event, handler);
    return () => {
      emitter.off(event, handler);
    };
  }

  function pub<T>(event: PubSubEvents, data?: T) {
    emitter.emit(event, data);
  }

  return {
    sub,
    pub,
  };
}
