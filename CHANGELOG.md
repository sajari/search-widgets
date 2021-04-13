# @sajari/search-widgets

## 1.3.3

### Patch Changes

- 38e383a: Allow for take over input to work if there are multiple results of a selector
- f05c2da: Upgrade SDK packages to include the fix for input styling being overridden by external CSS.
- 6d4fa78: Upgrade new version for React SDK packages to include the fix for Modal `z-index` issue.

## 1.3.2

### Patch Changes

- ce6949e: Remove origin whitelist when doing fast refresh

## 1.3.1

### Patch Changes

- 1aff0f3: Fix incorrect widget name passed in `data-widget` for the `overlay` mode.
- a4cd947: Hide the filter sidebar if there is no filter to avoid the left blank space on the interface for the overlay mode.

## 1.3.0

### Minor Changes

- 6573a88: Add support to display the search bar on top of the interface.

### Patch Changes

- 212ba72: Upgrade packages
- e6137c1: Fix the previous setting of a widget type is overridden by the default value if reselecting the widget. Plus, resolve the issue when the setting is empty in the first load.

## 1.2.0

### Minor Changes

- 5857d92: Add support for input placeholder
- 857a924: Add search input widget
- 43c21ae: Add widget selector

### Patch Changes

- b3a82ea: Added `defaultOpen` for `overlay` mode.
- 4b4a7c0: Upgrade packages to add support `maxSuggestions` and `autoFocus` for `Input`.
- 4354361: Fix selecting suggestion item doesn't trigger search request
- 05c967d: Added support for `customClassNames` and `disableDefaultStyles` for styling customization.
- b4758f4: Upgrade packages.
- 47c507c: Add support extra props for Modal in `overlay` mode.
- 391f2db: Evaluate DEPLOY_SCRIPT env when building

## 1.1.1

### Patch Changes

- e0ffc0c: Remove current events from button used to trigger the overlay modal to open. It's because the previous event might have the effect of changing the UI which can conflict with the modal transition.
- ce9556b: Upgrade packages.
- 3c32285: Fix some bugs with the takeover mode

## 1.1.0

### Minor Changes

- c39046c: Add default preset selector fallback for Shopify
- 2cb4891: Migrate from `styled-components` to `emotion`.
- 07a0990: Take over standard input

### Patch Changes

- 45deec9: Fixed `buttonSelector` not work properly with elements having children.

## 1.0.3

### Patch Changes

- b8e8e0f: Fix loader deployment

## 1.0.2

### Patch Changes

- 8075b70: Added sourcemap to deployment files

## 1.0.1

### Patch Changes

- c037f59: Fix the deployment script

## 1.0.0

### Patch Changes

- aa55731: Fixed UI does not match with the URL params for the aggregate `RangeFilter`.
- 29c21bf: Fix message event handler
