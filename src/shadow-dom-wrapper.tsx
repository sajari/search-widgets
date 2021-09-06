import type { ComponentType } from 'preact';
import { useMemo, useState } from 'preact/hooks';

import { renderInContainer } from './emotion-cache';
import type { SearchWidgetBaseOptions, WidgetType } from './types';
import { createDownshiftEnvironment } from './utils';

function attachShadowRoot(el: Element | null, { type }: { type: WidgetType }) {
  let target = el;

  if (type === 'overlay' || type === 'search-input-binding') {
    const name = `sajari-${type}-portal`;
    const portalEl = document.querySelector(name);
    // always move portal to end of body
    if (portalEl) document.body.appendChild(portalEl);
    // find container div
    const shadowRoot = portalEl?.shadowRoot;
    const container = shadowRoot?.querySelector('div');
    if (container) return { shadowRoot, container };
    // otherwise create & append new portal element
    target = document.body.appendChild(document.createElement(name));
  }

  const shadowRoot = target?.attachShadow({ mode: 'open' });
  const container = shadowRoot?.appendChild(document.createElement('div'));
  return { shadowRoot, container };
}

export default function withShadowRoot(
  Comp: ComponentType | ComponentType<SearchWidgetBaseOptions>,
  {
    type,
    mountElement,
  }: {
    type: WidgetType;
    mountElement: Element | null;
  },
) {
  if (type === 'token-check') {
    return Comp;
  }

  return ({ useShadowDOM, ...props }: SearchWidgetBaseOptions) => {
    const [{ shadowRoot, container }] = useState<ReturnType<typeof attachShadowRoot>>(() =>
      useShadowDOM ? attachShadowRoot(mountElement, { type }) : { shadowRoot: undefined, container: undefined },
    );

    const downshiftEnvironment = useMemo(
      () => (shadowRoot ? createDownshiftEnvironment(shadowRoot) : null),
      [shadowRoot],
    );

    if (!useShadowDOM) {
      return <Comp {...props} />;
    }

    if (type === 'search-results' || type === 'overlay' || type === 'search-input-binding') {
      return <Comp downshiftEnvironment={downshiftEnvironment} container={container} {...props} />;
    }

    return renderInContainer(<Comp {...props} />, { cacheKey: type, container });
  };
}
