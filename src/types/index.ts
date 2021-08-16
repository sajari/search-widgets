/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModalProps } from '@sajari/react-components';
import { VariableFieldValue, VariableFn } from '@sajari/react-hooks';
import {
  ContextProviderValues,
  FieldDictionary,
  FilterBuilder,
  FilterProps,
  InputProps as CoreInputProps,
  PaginationProps,
  RangeFilterBuilder,
  ResultsPerPageProps,
  ResultsProps,
  ResultViewType,
  SortingProps,
} from '@sajari/react-search-ui';
import { Emitter } from 'mitt';
import { ComponentChildren } from 'preact';

import { Breakpoints } from '../utils/styles';

export type InputMode = CoreInputProps<any>['mode'];

interface InputProps extends Omit<CoreInputProps<any>, 'showPoweredBy'> {
  mode?: Exclude<InputMode, 'results'>;
  placeholder?: string;
}

export type SyncURLType = 'none' | 'replace' | 'push';

type Mode = 'standard' | 'overlay';

type InputPosition = 'top' | 'aside';
type TextTransform = 'normal-case' | 'uppercase' | 'lowercase' | 'capitalize' | 'capitalize-first-letter';

export type SearchResultsOptions<M = Mode> = {
  resultsPerPage?: ResultsPerPageProps;
  sorting?: Omit<SortingProps, 'type'>;
  input?: InputProps & { hide?: boolean; position?: InputPosition };
  results?: ResultsProps & { viewType?: ResultViewType };
  pagination?: PaginationProps;
  mode?: M;
} & (
  | {
      mode: 'standard';
      syncURL?: SyncURLType;
      urlParams?: {
        q?: string;
      };
    }
  | {
      mode: 'overlay';
      buttonSelector?: string | string[];
      inputSelector?: string;
      ariaLabel?: string;
      defaultOpen?: boolean;
      modal?: ModalProps;
    }
);

export type PresetType = 'shopify' | 'website' | 'app' | undefined;
export type TrackingType = 'posneg' | 'click';

export interface SearchResultsProps {
  endpoint?: string;
  clickTokenURL?: string;
  account: string;
  collection: string;
  pipeline: string | { name: string; version?: string };
  tracking?:
    | TrackingType
    | {
        type: TrackingType;
        field: string;
      };
  preset: PresetType;
  fields?: FieldDictionary;
  filters?: Array<FilterProps & { field: string; textTransform?: TextTransform }>;
  defaultFilter: ContextProviderValues['defaultFilter'];
  variables: Record<string, Exclude<VariableFieldValue, VariableFn>>;
  config: ContextProviderValues['search']['config'];
  theme: ContextProviderValues['theme'];
  customClassNames?: ContextProviderValues['customClassNames'];
  disableDefaultStyles?: ContextProviderValues['disableDefaultStyles'];
  importantStyles?: ContextProviderValues['importantStyles'];
  currency?: ContextProviderValues['currency'];
  options?: SearchResultsOptions;
  emitter: Emitter;
}

export interface SearchResultsContextProps
  extends Required<Pick<SearchResultsProps, 'filters' | 'options' | 'preset'>> {
  children?: ComponentChildren;
  filterBuilders: (RangeFilterBuilder | FilterBuilder)[];
  id: string;
}

export interface PubSubContextProps {
  children?: ComponentChildren;
  emitter: Emitter;
}

export interface InterfaceContextProps {
  children?: ComponentChildren;
  breakpoints: Breakpoints;
  filtersShown: boolean;
  setWidth: (width: number) => void;
  setFiltersShown: (shown: boolean) => void;
}

export interface SearchInputBindingProps extends SearchResultsProps {
  selector: string;
  mode: Exclude<InputMode, 'instant'>;
  omittedElementSelectors?: string | string[];
}

export type WidgetType = 'search-results' | 'search-input-binding' | 'overlay' | 'search-input';

export interface SearchInputProps extends SearchResultsProps {
  mode: Exclude<InputMode, 'instant'>;
  redirect?: {
    url: string;
    queryParamName: string;
  };
}
