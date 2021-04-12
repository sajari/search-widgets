import { Input, SearchProvider } from '@sajari/react-search-ui';
import { render } from 'preact/compat';

import { getPresetSelector } from './defaults';
import { useSearchProviderProps } from './hooks';
import { InputMode, SearchInputBindingProps } from './types';

const attributesToBeRemoved = [
  'data-predictive-search-drawer-input',
  'role',
  'aria-autocomplete',
  'aria-owns',
  'aria-expanded',
  'aria-label',
  'aria-haspopup',
];

// To emulate form submission
const wrapInForm = (input: HTMLInputElement) => {
  const form = document.createElement('form');
  form.action = '/search';
  form.method = 'get';
  form.role = 'search';
  input.parentNode?.insertBefore(form, input);
  form.appendChild(input);
  return form;
};

const defaultMode: InputMode = 'suggestions';
const getSubmit = (mode: InputMode, form: HTMLFormElement) => () => {
  if (mode === defaultMode) {
    form.submit();
  }
};

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

const renderBindingInput = (targets: NodeListOf<HTMLElement>, props: Omit<SearchInputBindingProps, 'selector'>) => {
  targets.forEach((target) => {
    if (target instanceof HTMLInputElement) {
      // Remove the default attributes for autocomplete
      removeAttributes(target);

      const container = target.parentElement;
      const fragment = document.createDocumentFragment();
      const { mode = 'suggestions' } = props;
      const form = wrapInForm(target);

      render(
        <Wrapper {...props}>
          <Input mode={mode} onSelect={getSubmit(mode, form)} inputElement={{ current: target }} />
        </Wrapper>,
        (fragment as unknown) as Element,
      );
      container?.appendChild(fragment);
    } else {
      target.childNodes.forEach((node) => {
        const element = node as HTMLInputElement;

        if (!(element instanceof Element) || element.tagName !== 'INPUT') {
          return;
        }

        // Remove the default attributes for autocomplete
        removeAttributes(element);

        const { mode = 'suggestions' } = props;
        const fragment = document.createDocumentFragment();
        const form = wrapInForm(element);

        render(
          <Wrapper {...props}>
            <Input mode={mode} onSelect={getSubmit(mode, form)} inputElement={{ current: element }} />
          </Wrapper>,
          (fragment as unknown) as Element,
        );
        target.appendChild(fragment);
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
