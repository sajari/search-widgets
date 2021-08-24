import type { ComponentType } from 'preact';
import { useState } from 'preact/hooks';

import { renderInContainer } from './emotion-cache';
import type { SearchResultsProps, WidgetType } from './types';

function attachShadowRoot(el: Element | null, { type }: { type: WidgetType }) {
  let target = el;

  if (type === 'overlay' || type === 'search-input-binding') {
    const name = `sajari-${type}-portal`;
    const portalEl = document.querySelector(name);
    // always move portal to end of body
    if (portalEl) document.body.appendChild(portalEl);
    // find container div
    const container = portalEl?.shadowRoot?.querySelector('div');
    if (container) return container;
    // otherwise create & append new portal element
    target = document.body.appendChild(document.createElement(name));
  }

  const container = target?.attachShadow({ mode: 'open' }).appendChild(document.createElement('div'));
  return container;
}

export default function withShadowRoot(
  Comp: ComponentType<{ container?: HTMLElement }>,
  {
    type,
    mountElement,
  }: {
    type: WidgetType;
    mountElement: Element | null;
  },
) {
  return ({ useShadowDOM, ...props }: SearchResultsProps) => {
    const [container] = useState(() => (useShadowDOM ? attachShadowRoot(mountElement, { type }) : undefined));

    if (!useShadowDOM) {
      return <Comp {...props} />;
    }

    if (type === 'search-results' || type === 'overlay' || type === 'search-input-binding') {
      return <Comp container={container} {...props} />;
    }

    return renderInContainer(<Comp {...props} />, { cacheKey: type, container });
  };
}
