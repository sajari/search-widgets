import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { EventTracking } from '@sajari/react-search-ui';
import { render, waitFor } from '@testing-library/react';
import React, { ReactElement } from 'react';

import Tracking from './tracking';

describe('Tracking Widget', () => {
  it('called the track method with param', async () => {
    const tracking = new EventTracking('some-id');
    const metadata = { event: 'add_to_cart', id: 'product-id' };
    const events = [{ event: 'click', selector: 'article h3 > a', metadata }];
    const component = (
      <>
        <article>
          <h3>
            <a href="https://example.com">Some product</a>
          </h3>
        </article>
        <Tracking
          tracking={tracking}
          id="some-id"
          account="some-account"
          collection="some-collection"
          pipeline={{ name: 'some-pipeline' }}
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
