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

const removeThemeElements = (selectorsParam: string | string[]) => {
  const selectors = typeof selectorsParam === 'string' ? selectorsParam.split(' ') : selectorsParam;
  selectors.forEach((selector) => {
    const list = document.querySelectorAll(selector);
    list.forEach((element) => element.remove());
  });
};

const onSelectHandler = (element: Element | null) => () => {
  const form = element?.closest('form');
  form?.submit();
};

const Wrapper = ({
  children,
  ...props
}: Omit<SearchInputBindingProps, 'selector' | 'omittedElementSelectors' | 'mode'> & {
  children: React.ReactNode;
}) => {
  const { defaultFilter, theme, searchContext, currency } = useSearchProviderProps(props);

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad={false}
      defaultFilter={defaultFilter}
      currency={currency}
    >
      {children}
    </SearchProvider>
  );
};

const renderBindingInput = (
  targets: NodeListOf<HTMLElement>,
  params: Omit<SearchInputBindingProps, 'selector' | 'omittedElementSelectors'>,
) => {
  const { mode = 'suggestions', ...props } = params;
  targets.forEach((target) => {
    const showPoweredBy = props.preset !== 'shopify';

    if (target instanceof HTMLInputElement) {
      const fragment = document.createDocumentFragment();

      removeAttributes(target);

      render(
        <Wrapper {...props}>
          <Input
            mode={mode}
            onSelect={onSelectHandler(target)}
            inputElement={{ current: target }}
            showPoweredBy={showPoweredBy}
          />
        </Wrapper>,
        fragment as unknown as Element,
      );
    } else {
      target.childNodes.forEach((node) => {
        if (!(node instanceof Element) || node.tagName !== 'INPUT') {
          return;
        }

        const element = node as HTMLInputElement;
        const fragment = document.createDocumentFragment();

        removeAttributes(element);

        render(
          <Wrapper {...props}>
            <Input
              mode={mode}
              onSelect={onSelectHandler(element)}
              inputElement={{ current: element }}
              showPoweredBy={showPoweredBy}
            />
          </Wrapper>,
          fragment as unknown as Element,
        );
      });
    }
  });
};

export default ({ selector: selectorProp, omittedElementSelectors, ...rest }: SearchInputBindingProps) => {
  let targets: NodeListOf<HTMLElement> | null = null;
  let selector = selectorProp;
  if (!selectorProp) {
    selector = getPresetSelector(rest.preset);
  }
  targets = document.querySelectorAll(selector);

  if (targets && targets.length > 0) {
    if (omittedElementSelectors) {
      removeThemeElements(omittedElementSelectors);
    }
    renderBindingInput(targets, rest);
  }
  return null;
};
