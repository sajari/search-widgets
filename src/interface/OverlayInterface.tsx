import { Modal, ModalCloseButton, ResizeObserver } from '@sajari/react-components';
import { useQuery, useSearchContext, useSorting } from '@sajari/react-hooks';
import { isArray } from '@sajari/react-sdk-utils';
import { Filter, Input, Pagination, Results, useSearchUIContext } from '@sajari/react-search-ui';
// TODO: ideally this should be a generic solution in the Modal component
// making a note here so we (Thanh) can revisit the issue
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import { memo } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';
import tw from 'twin.macro';

import { useCustomContainer } from '../container/context';
import { useSearchResultsContext } from '../context';
import { getPresetSelectorOverlayMode } from '../defaults';
import { SearchResultsOptions } from '../types';
import { useInterfaceContext } from './context';
import Options from './Options';

function isSubmitInput(node: Element) {
  return node.tagName === 'INPUT' && node.getAttribute('type') === 'submit';
}

function isButton(node: Element) {
  return node.tagName === 'BUTTON' || node.getAttribute('role') === 'button';
}

const containerId = `sj-${Date.now()}`;

const OverlayInterface = () => {
  const { options, filters, id, preset } = useSearchResultsContext();
  const { results, pageCount, clear, resetFilters, error } = useSearchContext();
  const { setSorting } = useSorting();
  const { setQuery } = useQuery();
  const { setWidth, filtersShown, breakpoints } = useInterfaceContext();
  const { setViewType } = useSearchUIContext();
  const { container: modalContainer } = useCustomContainer();
  const tabsFilters = filters?.filter((props) => props.type === 'tabs') || [];
  const nonTabsFilters = filters?.filter((props) => props.type !== 'tabs') || [];
  const inputProps = options.input ?? {};

  const scrollTop = useCallback(() => {
    const container = document.querySelector(`#${containerId}`);
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const {
    buttonSelector: buttonSelectorProp = getPresetSelectorOverlayMode(preset),
    inputSelector,
    ariaLabel = 'Open search',
    defaultOpen = false,
    modal: modalProps,
  } = options as SearchResultsOptions<'overlay'>;
  const [open, setOpen] = useState(defaultOpen);
  const hideSidebar = nonTabsFilters.length === 0;

  useEffect(() => {
    const buttonSelectors = isArray(buttonSelectorProp) ? buttonSelectorProp : [buttonSelectorProp];
    const removeEventList: (() => void)[] = [];

    buttonSelectors.filter(Boolean).forEach((buttonSelector) => {
      const buttons = document.querySelectorAll(buttonSelector);
      const input = inputSelector ? (document.querySelector(inputSelector) as HTMLInputElement) : null;

      const openModal = (e: Event | KeyboardEvent) => {
        if (e instanceof KeyboardEvent && e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
          return;
        }
        e.preventDefault();
        e.stopPropagation();

        setOpen(true);
        const query = input?.value;
        if (query) {
          setQuery(query);
        }
      };

      buttons.forEach((btn) => {
        // Remove all registered events
        const cloneButton = btn.cloneNode(true) as HTMLElement;
        btn.parentNode?.replaceChild(cloneButton, btn);
        const button = cloneButton;

        if (!isButton(button) || !isSubmitInput(button)) {
          button.setAttribute('role', 'button');
          button.setAttribute('tabIndex', '0');
          button.setAttribute('aria-label', ariaLabel);

          button.querySelectorAll('*').forEach((node) => {
            if (node instanceof HTMLElement) {
              node.setAttribute('aria-hidden', 'true');
              node.setAttribute('tabIndex', '-1');
              // eslint-disable-next-line no-param-reassign
              node.style.pointerEvents = 'none';
            }

            node.addEventListener('click', (e) => {
              e.preventDefault();
            });
          });

          button.addEventListener('keydown', openModal);
        }
        button.addEventListener('click', openModal);
        removeEventList.push(() => {
          button?.removeEventListener('click', openModal);
          button?.removeEventListener('keydown', openModal);
        });
      });
    });

    return () => {
      removeEventList.forEach((removeListener) => removeListener());
    };
  }, [buttonSelectorProp, inputSelector]);

  const isMobile = !breakpoints.sm;

  useEffect(() => {
    if (isMobile && open) {
      setViewType('list');
    }
  }, [isMobile, open]);

  useEffect(() => {
    if (!open) {
      clearAllBodyScrollLocks();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  return (
    <Modal
      container={modalContainer}
      open={open}
      onClose={() => {
        setSorting('', false);
        resetFilters(false);
        setOpen(false);
        clear({ q: '' });
      }}
      center={false}
      size="7xl"
      animationDuration={75}
      fullWidth={isMobile}
      fullHeight={isMobile && (!!results || !!error)}
      {...modalProps}
    >
      <ResizeObserver onResize={(size) => setWidth(size.width)} css={tw`flex h-full overflow-hidden`}>
        <div css={[tw`flex flex-col flex-none w-full overflow-hidden`]}>
          <div css={tw`flex-none`}>
            <div
              css={[
                tw`py-4 pl-2.5 flex items-center`,
                (results || error) && tw`border-0 border-b border-gray-200 border-solid`,
              ]}
            >
              <Input
                {...inputProps}
                css={tw`w-full`}
                size={isMobile ? 'xl' : '2xl'}
                variant="unstyled"
                showPoweredBy={preset !== 'shopify'}
                autoFocus={modalProps?.autoFocus ?? true}
              />
              <div css={tw`flex justify-center flex-none w-14`}>
                <ModalCloseButton css={tw`m-0`} />
              </div>
            </div>

            {results && (
              <div css={[tw`pt-3.5 px-6`, isMobile ? tw`pb-2` : tw`pb-6`]}>
                <Options isMobile={isMobile} showToggleFilter={!hideSidebar} onScrollTop={scrollTop} mode="overlay" />
              </div>
            )}
          </div>

          <div
            id={id}
            css={[
              tw`flex flex-grow overflow-hidden transition-all duration-200`,
              (!filtersShown || hideSidebar) && tw`pl-6`,
            ]}
          >
            {results && !isMobile && (
              <div
                css={[
                  tw`flex-none overflow-y-auto transition-all duration-200`,
                  filtersShown && !hideSidebar ? tw`pl-6 pr-8 w-86` : tw`w-0 opacity-0`,
                ]}
              >
                <div css={tw`pb-6 space-y-6 w-72`}>
                  {nonTabsFilters.map((props) => {
                    const { type, textTransform = 'capitalize-first-letter' } = props;
                    if (type === 'list' || type === 'select') {
                      return <Filter {...{ ...props, textTransform }} key={props.name} />;
                    }
                    return <Filter {...props} key={props.name} />;
                  })}
                </div>
              </div>
            )}

            {(!!results || !!error) && (
              <div
                css={[
                  tw`flex flex-col`,
                  filtersShown && !hideSidebar && !error ? 'width: calc(100% - 21.5rem);' : tw`w-full`,
                ]}
              >
                {tabsFilters.length > 0 && !error ? (
                  <div css={tw`pr-6 space-y-6`}>
                    {tabsFilters.map((props) => {
                      const { textTransform = 'capitalize-first-letter' } = props;
                      return <Filter {...props} type="tabs" textTransform={textTransform} key={props.name} />;
                    })}
                  </div>
                ) : null}

                <div
                  id={containerId}
                  css={tw`pt-6 pr-6 overflow-y-auto`}
                  ref={(node) => {
                    if (!node) return;
                    disableBodyScroll(node);
                  }}
                >
                  <div css={tw`mb-6`}>
                    <Results {...options.results} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {pageCount > 1 ? (
            <div css={tw`flex-none border-0 border-t border-solid border-gray-200 py-3.5 px-6`}>
              <Pagination {...options.pagination} scrollTarget={`#${containerId}`} />
            </div>
          ) : null}
        </div>
      </ResizeObserver>
    </Modal>
  );
};

export default memo(OverlayInterface);
