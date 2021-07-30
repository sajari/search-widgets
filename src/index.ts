import mitt from 'mitt';
import { ComponentType } from 'preact';
import habitat from 'preact-habitat';

import SearchInput from './search-input';
import SearchInputBinding from './search-input-binding';
import SearchResults from './search-results';
import { WidgetType } from './types';

if (!process.env.DEPLOY_SCRIPT) {
  import('./dev/app')
    .then(({ default: setupApp }) => {
      setupApp();
    })
    .catch(console.error);
}

const components: Record<WidgetType, ComponentType> = {
  'search-results': SearchResults as ComponentType,
  overlay: SearchResults as ComponentType,
  'search-input-binding': SearchInputBinding as ComponentType,
  'search-input': SearchInput as ComponentType,
};

const attribute = 'data-widget';
const emitter = mitt();

const attachShadowRoot = (el: Element | null, { type }: { type: WidgetType }) => {
  const target = type === 'overlay' ? document.body.appendChild(document.createElement('sajari-portal')) : el;
  const container = target?.attachShadow({ mode: 'open' }).appendChild(document.createElement('div'));
  return container;
};

const renderAll = () => {
  // Build widgets
  (Object.entries(components) as Array<[WidgetType, ComponentType]>).forEach(([type, component]) => {
    const selector = `[${attribute}="${type}"]`;

    habitat(component).render({
      selector,
      clean: true,
      defaultProps: {
        emitter,
        container: attachShadowRoot(document.querySelector(selector), { type }),
      },
    });
  });

  // Setup a node
  const setup = (element: Element) => {
    if (!element.hasAttribute(attribute)) {
      return;
    }

    const type = element.getAttribute(attribute) as WidgetType;

    if (!Object.keys(components).includes(type)) {
      return;
    }

    // Generate ID
    const id = `widget-${Date.now()}`;
    element.setAttribute('id', id);

    const component = components[type];

    habitat(component).render({
      selector: `#${id}`,
      clean: true,
      defaultProps: {
        emitter,
        container: attachShadowRoot(element, { type }),
      },
    });
  };

  // Create an observer instance
  const observer = new MutationObserver((mutations) => {
    Array.from(mutations).forEach((mutation) => {
      Array.from(mutation.addedNodes).forEach((node) => {
        const element = node as Element;

        if (!(element instanceof Element)) {
          return;
        }

        // Find any children that match
        const children = element.querySelectorAll(`[${attribute}]`);
        Array.from(children).forEach(setup);

        // Set up the node itself
        setup(element);
      });
    });
  });

  // Pass in the target node, as well as the observer options
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

if (typeof window !== 'undefined') {
  // Wait for load
  document.addEventListener('DOMContentLoaded', renderAll, false);

  // Already loaded
  if (document.readyState !== 'loading') {
    renderAll();
  }
}
