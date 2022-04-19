import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { EventTracking, Pipeline } from '@sajari/react-search-ui';
import { render, waitFor } from '@testing-library/react';
import React, { ReactElement } from 'react';

import Tracking from './tracking';

describe('Tracking Widget', () => {
  it('called the track method with param', async () => {
    const config = {
      collection: 'some-collection',
      account: 'some-account',
      pipeline: { name: 'some-pipeline' },
    };
    const pipeline = new Pipeline(
      { collection: config.collection, account: config.account },
      config.pipeline,
      new EventTracking('some-id'),
    );
    const tracking = pipeline.getTracking() as EventTracking;
    const metadata = { event: 'add_to_cart', id: 'product-id' };
    const events = [{ event: 'click', selector: 'article h3 > a', metadata }];
    // We use simple markup instead of the Results component because otherwise we'd have to mock request/response (install msw)
    const component = (
      <>
        <article>
          <h3>
            <a href="https://example.com">Some product</a>
          </h3>
        </article>
        <Tracking
          account="some-account"
          pipeline={{ name: 'some-pipeline' }}
          collection="some-collection"
          tracking={tracking}
          id="some-id"
          events={events}
        />
      </>
    );
    const { container } = render(component as ReactElement);
    const item = await waitFor(() => container.querySelector<HTMLAnchorElement>('article h3 > a'));
    const mockTracking = jest.fn();
    tracking.searchIOAnalytics.track = mockTracking;
    item?.click();

    expect(mockTracking).toBeCalledWith(metadata.event, metadata.id, undefined);
  });
});
