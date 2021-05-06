import { css, keyframes } from '@emotion/core';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@sajari/react-components';
import { useFilter, useRangeFilter, useSearchContext } from '@sajari/react-hooks';
import {
  Filter,
  FilterProps,
  ResultsPerPage,
  Sorting,
  Summary as CoreSummary,
  ViewType,
} from '@sajari/react-search-ui';
import { useEffect } from 'preact/hooks';
import React, { useState } from 'react';
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
}

const FilterWatcher = ({ name, toggle }: { name: string; toggle: (v: boolean) => void }) => {
  const { selected } = useFilter(name);
  useEffect(() => {
    toggle(selected.length > 0);
  }, [selected]);

  return null;
};

const RangeFilterWatcher = ({ name, toggle }: { name: string; toggle: (v: boolean) => void }) => {
  const { range, max, min } = useRangeFilter(name);
  useEffect(() => {
    toggle(min !== range?.[0] || max !== range?.[1]);
  }, [range, max, min]);

  return null;
};

const FilterWatchers = ({
  filters,
  setSelectedFilter,
}: {
  filters: FilterProps[];
  setSelectedFilter: (index: number, value: boolean) => void;
}) => {
  return (
    <React.Fragment>
      {filters.map(({ name, type }, index) =>
        type === 'range' ? (
          <RangeFilterWatcher
            key={name}
            name={name}
            toggle={(v: boolean) => {
              setSelectedFilter(index, v);
            }}
          />
        ) : (
          <FilterWatcher
            key={name}
            name={name}
            toggle={(v: boolean) => {
              setSelectedFilter(index, v);
            }}
          />
        ),
      )}
    </React.Fragment>
  );
};

export default ({ showToggleFilter = true, isMobile = false }: Props) => {
  const { options, filters } = useSearchResultsContext();
  const { breakpoints } = useInterfaceContext();
  const { reset } = useSearchContext();
  const md = Boolean(breakpoints.md);
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const nonTabsFilters = filters?.filter((props) => props.type !== 'tabs') || [];
  const [filterList, setFilterList] = useState(filters.map(() => false));
  const count = filterList.filter(Boolean).length;

  const setSelectedFilter = (index: number, value: boolean) => {
    const newValues = [...filterList];
    newValues[index] = value;
    setFilterList(newValues);
  };

  return (
    <div css={md ? tw`flex items-center justify-between space-x-4` : tw`space-y-4`}>
      <div css={[tw`flex items-end space-x-4`, md ? tw`justify-end` : tw`justify-between`]}>
        <Summary />
        {isMobile && (
          <Button onClick={onOpen} size="sm">
            Filters
          </Button>
        )}
      </div>
      <FilterWatchers filters={filters} setSelectedFilter={setSelectedFilter} />

      {!isMobile && (
        <div css={[tw`flex items-end space-x-4`, md ? tw`justify-end` : tw`justify-between`]}>
          <ResultsPerPage size="sm" inline={md} options={options.resultsPerPage?.options} />

          {options.sorting?.options && options.sorting.options.length > 0 && (
            <Sorting size="sm" inline={md} options={options.sorting?.options} />
          )}

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
        fullscreen
        fullheight
      >
        <ModalHeader>
          <ModalTitle css={tw`text-xl mt-3`}>Filters</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <div css={tw`space-y-6 divide-y pb-16`}>
            {nonTabsFilters.map((props) => {
              const { type, textTransform = 'capitalize-first-letter' } = props;
              if (type === 'list' || type === 'select') {
                return <Filter {...{ ...props, textTransform }} key={props.name} />;
              }
              return <Filter {...props} key={props.name} />;
            })}
          </div>
        </ModalBody>
        <ModalFooter
          css={[
            tw`flex justify-center absolute bottom-0 inset-x-0 border border-t border-gray-200 duration-200 transition-all transform`,
            count === 0 ? tw`translate-y-full opacity-0` : tw`translate-y-0 opacity-100`,
          ]}
        >
          <Button
            onClick={() => {
              reset();
              setFilterList(filters.map(() => false));
            }}
          >
            {`Clear (${count})`}
          </Button>
          <Button onClick={onClose} appearance="primary">
            Apply
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
