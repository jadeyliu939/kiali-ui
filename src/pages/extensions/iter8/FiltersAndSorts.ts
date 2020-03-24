import { FILTER_ACTION_APPEND, FilterType } from '../../../types/Filters';
import { SortField } from '../../../types/SortFilters';
import { Iter8Experiment } from '../../../types/Iter8';
import { TextInputTypes } from '@patternfly/react-core';

// Place Holder, not quite finished yet. Or if filter is needed, and how to use the common filters?

export const sortFields: SortField<Iter8Experiment>[] = [
  {
    id: 'namespace',
    title: 'Namespace',
    isNumeric: false,
    param: 'ns',
    compare: (a, b) => a.namespace.localeCompare(b.namespace)
  },
  {
    id: 'name',
    title: 'Name',
    isNumeric: false,
    param: 'wn',
    compare: (a, b) => a.name.localeCompare(b.name)
  },
  {
    id: 'phase',
    title: 'Phase',
    isNumeric: false,
    param: 'is',
    compare: (a, b) => a.phase.localeCompare(b.phase)
  },
  {
    id: 'baseline',
    title: 'Baseline',
    isNumeric: false,
    param: 'is',
    compare: (a, b) => a.baseline.localeCompare(b.baseline)
  },
  {
    id: 'candidate',
    title: 'Candidate',
    isNumeric: false,
    param: 'is',
    compare: (a, b) => a.candidate.localeCompare(b.candidate)
  }
];

const appNameFilter: FilterType = {
  id: 'name',
  title: 'Name',
  placeholder: 'Filter by Experiment Name',
  filterType: TextInputTypes.text,
  action: FILTER_ACTION_APPEND,
  filterValues: []
};

export const availableFilters: FilterType[] = [appNameFilter];

/** Sort Method */
