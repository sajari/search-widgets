/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface InputProps extends CoreInputProps<any> {
  mode?: Exclude<CoreInputProps<any>['mode'], 'results'>;
}

export type SyncURLType = 'none' | 'replace' | 'push';

export interface AppOptions {
  resultsPerPage?: ResultsPerPageProps;
  sorting?: SortingProps;
  input?: InputProps & { hide?: boolean };
  results?: ResultsProps & { viewType?: ResultViewType };
  pagination?: PaginationProps;
  syncURL?: SyncURLType;
  urlParams?: {
    q?: string;
  };
}

export type PresetType = 'shopify' | 'website' | undefined;
export type TrackingType = 'posneg' | 'click';

export interface AppProps {
  endpoint?: string;
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
  filters?: Array<FilterProps & { field: string }>;
  defaultFilter: ContextProviderValues['defaultFilter'];
  variables: ContextProviderValues['search']['variables'];
  config: ContextProviderValues['search']['config'];
  theme: ContextProviderValues['theme'];
  options?: AppOptions;
  emitter: Emitter;
}

export interface AppContextProps extends Required<Pick<AppProps, 'filters' | 'options'>> {
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
  setFiltersShown: (shown: boolean) => void;
}
