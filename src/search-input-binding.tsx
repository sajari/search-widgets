import { Input, SearchProvider } from '@sajari/react-search-ui';
import { render } from 'preact/compat';

import { getPresetSelector } from './defaults';
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

const onSelectHandler = (element: Element | null) => () => {
  const form = element?.closest('form');
  form?.submit();
};

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

const renderBindingInput = (targets: NodeListOf<HTMLElement>, props: Omit<SearchInputBindingProps, 'selector'>) => {
  targets.forEach((target) => {
    const showPoweredBy = props.preset !== 'shopify';

    if (target instanceof HTMLInputElement) {
      const cloned = target.cloneNode(true) as HTMLInputElement;
      target.replaceWith(cloned);
      const fragment = document.createDocumentFragment();

      removeAttributes(cloned);

      render(
        <Wrapper {...props}>
          <Input
            mode="suggestions"
            onSelect={onSelectHandler(cloned)}
            inputElement={{ current: cloned }}
            showPoweredBy={showPoweredBy}
          />
        </Wrapper>,
        (fragment as unknown) as Element,
      );
    } else {
      target.childNodes.forEach((node) => {
        const cloned = node.cloneNode(true) as HTMLInputElement;
        node.replaceWith(cloned);

        if (!(cloned instanceof Element) || cloned.tagName !== 'INPUT') {
          return;
        }

        const fragment = document.createDocumentFragment();

        removeAttributes(cloned);

        render(
          <Wrapper {...props}>
            <Input
              mode="suggestions"
              onSelect={onSelectHandler(cloned)}
              inputElement={{ current: cloned }}
              showPoweredBy={showPoweredBy}
            />
          </Wrapper>,
          (fragment as unknown) as Element,
        );
      });
    }
  });
};

export default ({ selector: selectorProp, ...rest }: SearchInputBindingProps) => {
  let targets: NodeListOf<HTMLElement> | null = null;
  let selector = selectorProp;
  if (!selectorProp) {
    selector = getPresetSelector(rest.preset);
  }
  targets = document.querySelectorAll(selector);

  if (targets && targets.length > 0) {
    renderBindingInput(targets, rest);
  }
  return null;
};
