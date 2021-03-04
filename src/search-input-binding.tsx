import { Input, SearchProvider } from '@sajari/react-search-ui';
import { render } from 'preact/compat';

import { useSearchProviderProps } from './hooks';
import { SearchInputBindingProps } from './types';

const attributesToBeRemoved = [
  'data-predictive-search-drawer-input',
  'role',
  'aria-autocomplete',
  'aria-owns',
  'aria-expanded',
  'aria-label',
  'aria-haspopup',
];

const removeAttributes = (element: Element | null) =>
  attributesToBeRemoved.forEach((attr) => element?.removeAttribute(attr));

const Wrapper = ({ children, ...props }: Omit<SearchInputBindingProps, 'selector'> & { children: React.ReactNode }) => {
  const { searchOnLoad, viewType, defaultFilter, theme, searchContext } = useSearchProviderProps(props);

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad={searchOnLoad}
      defaultFilter={defaultFilter}
      viewType={viewType}
    >
      {children}
    </SearchProvider>
  );
};

export default ({ selector, ...rest }: SearchInputBindingProps) => {
  const container = document.querySelector(selector) as HTMLElement;

  if (container) {
    // Make sure the suggestions don't overflow
    if (!container.style.position || container.style.position === 'static') {
      container.style.position = 'relative';
    }

    container.childNodes.forEach((node) => {
      const element = node as HTMLInputElement;

      if (!(element instanceof Element) || element.tagName !== 'INPUT') {
        return;
      }

      // Remove the default attributes for autocomplete
      removeAttributes(element);

      const mode = element.dataset.type as never;
      const fragment = document.createDocumentFragment();

      render(
        <Wrapper {...rest}>
          <Input mode={mode ?? 'instant'} inputElement={{ current: element }} />
        </Wrapper>,
        (fragment as unknown) as Element,
      );
      container.appendChild(fragment);
    });
  }

  return null;
};
