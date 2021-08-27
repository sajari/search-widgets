import { Input, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
import { render } from 'preact/compat';
import { useMemo } from 'react';

import { getPresetSelector } from './defaults';
import { EmotionCache } from './emotion-cache';
import { SearchInputBindingProps } from './types';
import { getPipelineInfo } from './utils';
import { getTracking } from './utils/getTracking';

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
  const {
    variables: variablesProp,
    account,
    collection,
    endpoint,
    clickTokenURL,
    pipeline,
    config,
    fields,
    theme,
    defaultFilter,
    currency,
  } = props;

  const tracking = getTracking(props);

  const searchContext = useMemo(() => {
    const { name, version = undefined } = getPipelineInfo(pipeline);
    const variables = new Variables({ ...variablesProp });

    return {
      pipeline: new Pipeline(
        {
          account,
          collection,
          endpoint,
          clickTokenURL,
        },
        { name, version },
        tracking,
      ),
      config,
      variables,
      fields,
    };
  }, []);

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
  const { mode = 'suggestions', container, ...props } = params;

  targets.forEach((target) => {
    const showPoweredBy = props.preset !== 'shopify';

    if (target instanceof HTMLInputElement) {
      const fragment = document.createDocumentFragment();

      removeAttributes(target);

      render(
        <Wrapper {...props}>
          <EmotionCache cacheKey={mode} container={container}>
            <Input
              portalContainer={container}
              mode={mode}
              onSelect={onSelectHandler(target)}
              inputElement={{ current: target }}
              showPoweredBy={showPoweredBy}
            />
          </EmotionCache>
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
            <EmotionCache cacheKey={mode} container={container}>
              <Input
                portalContainer={container}
                mode={mode}
                onSelect={onSelectHandler(element)}
                inputElement={{ current: element }}
                showPoweredBy={showPoweredBy}
              />
            </EmotionCache>
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
