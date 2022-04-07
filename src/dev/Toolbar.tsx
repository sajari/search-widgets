import { Select, Option } from '@sajari/react-components';
import { WidgetType } from '../types';
import { useState } from 'react';

interface Props {
  widget: WidgetType;
  onWidgetChange: (widget: WidgetType) => void;
}

const widgets: { name: string; value: WidgetType }[] = [
  { name: 'Search Results', value: 'search-results' },
  { name: 'Takeover search input', value: 'search-input-binding' },
  { name: 'Search Input', value: 'search-input' },
  { name: 'Overlay', value: 'overlay' },
  { name: 'Tracking', value: 'tracking' },
];

export const Toolbar = ({ widget, onWidgetChange }: Props) => {
  const [state, setState] = useState(widget);
  return (
    <Select
      value={state}
      styles={{ width: '100%' }}
      size="sm"
      onChange={(widget) => {
        onWidgetChange(widget as WidgetType);
        setState(widget as WidgetType);
      }}
    >
      {widgets.map((w) => {
        return <Option value={w.value}>{w.name}</Option>;
      })}
    </Select>
  );
};
