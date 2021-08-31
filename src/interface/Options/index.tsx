import { keyframes } from '@emotion/core';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@sajari/react-components';
import { RangeFilterBuilder, useFilter, useRangeFilter, useSearchContext } from '@sajari/react-hooks';
import {
  Filter,
  FilterProps,
  ResultsPerPage,
  Sorting,
  Summary as CoreSummary,
  ViewType,
} from '@sajari/react-search-ui';
// TODO: ideally this should be a generic solution in the Modal component
// making a note here so we (Thanh) can revisit the issue
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import React, { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';

import { useSearchResultsContext } from '../../context';
import { useInterfaceContext } from '../context';
import ToggleFilters from './ToggleFilters';

const animateModalIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(400px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const animateModalOut = keyframes`
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(400px);
    }
`;

const Summary = styled(CoreSummary)`
  ${tw`text-lg`}
`;

interface Props {
  showToggleFilter?: boolean;
  isMobile?: boolean;
  onScrollTop?: () => void;
  mode?: 'standard' | 'overlay';
}

const FilterWatcher = ({ name, toggleIsActive }: { name: string; toggleIsActive: (v: boolean) => void }) => {
  const { selected } = useFilter(name);
  useEffect(() => {
    toggleIsActive(selected.length > 0);
  }, [selected]);

  return null;
};

const RangeFilterWatcher = ({ name, toggleIsActive }: { name: string; toggleIsActive: (v: boolean) => void }) => {
  const { range, max, min } = useRangeFilter(name);
  useEffect(() => {
    toggleIsActive(min !== range?.[0] || max !== range?.[1]);
  }, [range, max, min]);

  return null;
};

const FilterWatchers = ({
  filters,
  setActiveFilter,
}: {
  filters: FilterProps[];
  setActiveFilter: (index: number, value: boolean) => void;
}) => {
  return (
    <React.Fragment>
      {filters.map(({ name, type }, index) => {
        const Component = type === 'range' ? RangeFilterWatcher : FilterWatcher;
        return (
          <Component
            key={name}
            name={name}
            toggleIsActive={(v: boolean) => {
              setActiveFilter(index, v);
            }}
          />
        );
      })}
    </React.Fragment>
  );
};

export default ({ showToggleFilter = true, isMobile = false, onScrollTop, mode = 'standard' }: Props) => {
  const { options, filters, filterBuilders } = useSearchResultsContext();
  const { breakpoints } = useInterfaceContext();
  const { resetFilters, results } = useSearchContext();
  const md = Boolean(breakpoints.md);
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const nonTabsFilters = filters?.filter((props) => props.type !== 'tabs') || [];
  const [filterList, setActiveFilterList] = useState(filters.map(() => false));
  const count = filterList.filter(Boolean).length;
  let refScrollBox: HTMLDivElement | null;

  const setActiveFilter = (index: number, value: boolean) => {
    const newValues = [...filterList];
    newValues[index] = value;
    setActiveFilterList(newValues);
  };

  useEffect(() => {
    // Freeze the state of the rangeFilterBuilder to avoid the UI from being overridden after reopenning the modal
    let timeout: ReturnType<typeof setTimeout>;
    if (open) {
      const rangeFilters = filterBuilders
        .filter((fb) => fb instanceof RangeFilterBuilder)
        .map((fb) => fb as RangeFilterBuilder);
      rangeFilters.forEach((fb) => fb.setFrozen(true));
      timeout = setTimeout(() => {
        rangeFilters.forEach((fb) => fb.setFrozen(false));
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (refScrollBox && !open) {
      enableBodyScroll(refScrollBox);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (refScrollBox) {
        enableBodyScroll(refScrollBox);
      }
    };
  }, []);

  const showSorting = options.sorting?.options && options.sorting.options.length;

  return (
    <div css={md ? tw`flex items-center justify-between space-x-4` : tw`space-y-4`}>
      <div css={[tw`flex`, md ? tw`justify-end items-end` : tw`justify-between items-start`]}>
        <Summary />
        {isMobile && (
          <Button
            onClick={onOpen}
            size="sm"
            css={[tw`border-none bg-transparent shadow-none h-7`, mode === 'overlay' ? tw`-mr-3 my-0 ml-0` : tw`m-0`]}
            aria-label="Show filters"
          >
            <svg height="16" width="16" viewBox="0 0 16 16" focusable="false" role="presentation">
              <path
                fill="currentColor"
                d="M15 3h-4c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1s-.4-1-1-1zM5 1c-1.3 0-2.4.9-2.8 2H1c-.6 0-1 .4-1 1s.4 1 1 1h1.2C2.6 6.1 3.7 7 5 7c1.7 0 3-1.3 3-3S6.7 1 5 1zM1 13h4c.6 0 1-.4 1-1s-.4-1-1-1H1c-.6 0-1 .4-1 1s.4 1 1 1zM15 11h-1.2c-.4-1.2-1.5-2-2.8-2-1.7 0-3 1.3-3 3s1.3 3 3 3c1.3 0 2.4-.9 2.8-2H15c.6 0 1-.4 1-1s-.4-1-1-1z"
              />
            </svg>
          </Button>
        )}
      </div>

      <FilterWatchers filters={filters} setActiveFilter={setActiveFilter} />

      {!isMobile && (
        <div css={[tw`flex items-end space-x-4`, md ? tw`justify-end` : tw`justify-between`]}>
          <ResultsPerPage size="sm" inline={md} options={options.resultsPerPage?.options} />

          {showSorting && <Sorting type="select" size="sm" inline={md} options={options.sorting?.options} />}

          <ViewType size="sm" inline={md} />

          {showToggleFilter && <ToggleFilters />}
        </div>
      )}

      <Modal
        open={open}
        onClose={onClose}
        modalAnimationIn={animateModalIn}
        modalAnimationOut={animateModalOut}
        animationDuration={300}
        fullWidth
        fullHeight
      >
        <ModalHeader css={['font-size: 16px;']}>
          <ModalTitle css={tw`text-xl`}>Filters</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody
          css={[tw`pt-2`, 'font-size: 16px;']}
          ref={(node) => {
            if (!node) return;
            refScrollBox = node;
            disableBodyScroll(node);
          }}
        >
          <div css={[tw`space-y-6 divide-y`, count === 0 ? tw`pb-0` : tw`pb-16`]}>
            {showSorting && <Sorting type="list" size="sm" inline={md} options={options.sorting?.options} />}
            {results &&
              nonTabsFilters.map((props) => {
                const { type, textTransform = 'capitalize-first-letter' } = props;
                if (type === 'list' || type === 'select') {
                  return <Filter {...{ ...props, textTransform }} key={props.name} />;
                }
                return <Filter {...props} key={props.name} />;
              })}
          </div>
        </ModalBody>
        <div css={[tw`absolute bottom-0 inset-x-0`, count === 0 ? tw`h-0` : tw`h-12`, 'font-size: 16px;']}>
          <ModalFooter
            css={[
              tw`flex justify-center absolute bottom-0 inset-x-0 border border-solid border-t border-gray-200 duration-200 transition-all transform bg-white`,
              count === 0 ? tw`translate-y-full opacity-0 h-0` : tw`translate-y-0 opacity-100`,
            ]}
          >
            <Button
              onClick={() => {
                resetFilters();
                setActiveFilterList(filters.map(() => false));
              }}
              css={tw`w-1/2 m-0`}
            >
              {`Clear (${count})`}
            </Button>
            <Button
              onClick={() => {
                onClose();
                if (onScrollTop) {
                  onScrollTop();
                }
              }}
              appearance="primary"
              css={tw`w-1/2 m-0`}
            >
              Apply
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
