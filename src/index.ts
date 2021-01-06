import { ComponentType } from 'preact';
import habitat from 'preact-habitat';

import App from './app';

const components: Record<string, ComponentType> = {
  'search-results': App as ComponentType,
};

const attribute = 'data-widget';

const renderAll = () => {
  // Build widgets
  Object.entries(components).forEach(([type, component]) => {
    habitat(component).render({
      selector: `[${attribute}="${type}"]`,
      clean: true,
    });
  });

  // Setup a node
  const setup = (element: Element) => {
    if (!element.hasAttribute(attribute)) {
      return;
    }

    const type = element.getAttribute(attribute) as string;

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
