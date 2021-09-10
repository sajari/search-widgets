# @sajari/search-widgets

## 2.7.0

### Minor Changes

- 951f737: feat: handle right and middle click in result tracking

## 2.6.1

### Patch Changes

- 0c670da: bring back `box-sizing` style when using shadowDOM option, and only applies within `:host` select (.eg childs of the shadow-root node)
- 5502aa2: Update search-ui to fix the variant image bug

## 2.6.0

### Minor Changes

- 6376c30: Bump SDK version to use new features in result template

### Patch Changes

- 1675a03: Fix typing conflict issues due to SDK version mismatch.

## 2.5.1

### Patch Changes

- 777f03d: chore: quick fix for global box-sizing override

## 2.5.0

### Minor Changes

- 6819e19: chore: cleanup of build problem to enable release

### Patch Changes

- 6819e19: chore: upgrade dependencies to avoid conflicting type imports

## 2.4.0

### Minor Changes

- b1ca565: Allow mounting widgets in Shadow DOM with `useShadowDOM` option.
- ede2c73: feat: implement posneg tracking for shopify

### Patch Changes

- 4f91ecf: chore: bump downstream packages to improve IE11 support

## 2.3.4

### Patch Changes

- 86663b5: Fix ViewType button margin issue.

## 2.3.3

### Patch Changes

- f44ee2c: Specify 16px font size at the outer most div to avoid the child elements font-size and box model being modified by a container wrapping the widgets.
- 98e9ed2: Fix margin of buttons is overridden by theme CSS.

## 2.3.2

### Patch Changes

- 48e2cc0: Set default 2 columns grid view on mobile screens for shopify and app preset.

## 2.3.1

### Patch Changes

- 64ad2d5: Fix passing a wrong type of tracking object breaks the search input

## 2.3.0

### Minor Changes

- e0dac5e: Support `shopifyOptions` for Search Result Widget to determine whether to pull results for a specific collection.

  ```html
  <div data-widget="search-results">
    <script type="application/json">
      {
        "shopifyOptions": {
          "collectionHandle": "{{collection.handle}}",
          "collectionId": "{{collection.id}}"
        }
      }
    </script>
  </div>
  ```

- bf35dcb: feat: allow an alternative clickTokenURL to be provided for testing purposes

### Patch Changes

- 65afbf0: Refactor the base interface of widgets, which should not include the properties of the Search Results Widget.
- 05c6c6a: Fix `form.submit()` doesn't trigger submit event via `addEventListener('submit')` by using `form.requestSubmit` method.
- 6c05523: Remove internal `useContext` and reuse the one from `@sajari/react-sdk-utils`.

## 2.2.5

### Patch Changes

- 628a691: chore: bump react-sdk deps to enable setting zIndex, trapFocus and autofocus props.

## 2.2.4

### Patch Changes

- d18aed3: Fix eslint warnings that is blocking the build.

## 2.2.3

### Patch Changes

- f3794b6: Downgrade prettier beause new version breaks the ci pipeline

## 2.2.2

### Patch Changes

- 329ef0c: Upgrade the SDK packages to fix the issue when the footer of the overlay modal gets hidden on iPad. See https://github.com/sajari/sdk-react/pull/580.
- 1e9ee0a: Upgrade dev dependencies including TypeScript, husky and various eslint plugins.

## 2.2.1

### Patch Changes

- 5880c10: Add translation for the show/hide filter button

## 2.2.0

### Minor Changes

- 0fa76a0: Upgrade new versions of SDK to include the template feature, the variant and the status feature.

### Patch Changes

- 8b823e5: Fix if the schema of app collections does not contain `url`, it will break the app due to the tracking failed to be initialized.
- e1295a5: Remove search on load calls in takeover input

## 2.1.0

### Minor Changes

- 1228c71: Add support for app collections.

### Patch Changes

- 43c261d: Upgrade the SDK packages to include the fix when `_id` is missing in the backend response. See https://github.com/sajari/sdk-react/pull/564.

## 2.0.1

### Patch Changes

- 9e29335: Due to an incident from a major bump, we’d want the loader CDN link v1 to point to v2 of the bundle (so that existing users won’t have to update the CDN link).

## 2.0.0

### Major Changes

- f7505f4: Clear filters on a new search.

### Minor Changes

- 42ec4ac: Show product's variant images if any

### Patch Changes

- 4388f40: Change `yarn dev` to start at `localhost` instead `0.0.0.0` to avoid permission denied issues.

## 1.9.1

### Patch Changes

- 7d03747: Skip typing issues that block the build process.

## 1.9.0

### Minor Changes

- 3350de0: Bump version of react-hooks in order to pick up sale price feature.

## 1.8.0

### Minor Changes

- 41759a6: Bump react-search-ui dependency, this enables the sale price feature

### Patch Changes

- 7ed457f: Allow the takeover widget to have other modes other than suggestions
- 1bc1d26: Fix the incorrect type of `variables`, where it should be the valid parameter of the constructor of `Variables` class.
- 199458a: Fix unable to customize `config`.

## 1.7.0

### Minor Changes

- f4398ca: Add configuration for currency code to format any price values.

  ```JSON
  {
     "account": "1594153711901724220",
     "collection": "bestbuy",
     "pipeline": "query",
     "currency": "USD",
     ...
  }
  ```

## 1.6.1

### Patch Changes

- d3fe708: Fix the issue when `undefined` appears in the URL if selecting a value from a manual filter.

## 1.6.0

### Minor Changes

- 4cadcc8: Add mobile display for the full page search.
- f1b201d: Upgrade new versions for SDK packages to include a minor styling fix and add a button to reset the search if an error occurs.

### Patch Changes

- ddc1ef4: Set `syncURL: 'push'` for website collection to fix the issue when the query params from the URL are not synced with the UI.

## 1.5.2

### Patch Changes

- 8a8c0e3: Display UI for the error state to prevent a failed search in the overlay from breaking UI.

## 1.5.1

### Patch Changes

- 084a83d: Stop the click event from being triggered on the parent nodes. In most cases, we only want the click on the node (buttonSelector) to trigger the overlay modal to open rather than calling the script from themes.

## 1.5.0

### Minor Changes

- b27ccf5: Upgrade SDK packages to include:

  - Update the `z-index` of modal to the maximum number of `2147483647`.
  - Add support `includes`, `excludes`, and `prefixFilter` option for filter settings.

### Patch Changes

- 541e4db: Fix the issue when using the browser back button can break the range filter.

## 1.4.4

### Patch Changes

- bdd4f36: Improve UX for the mobile overlay by automatically scrolling to top if the pagination or apply filters button was used.

## 1.4.3

### Patch Changes

- 46267d2: Renable the mobile overlay after resolving scroll blocking issue.

## 1.4.2

### Patch Changes

- a7bd4d5: Upgrade SDK packages to fix various UI break and SEO issues.

## 1.4.1

### Patch Changes

- 9ed199f: There is a bug that prevents users from scrolling on the mobile overlay. Basically, it makes it hard to interact with the app.

## 1.4.0

### Minor Changes

- 30e08a9: Add support mobile view for the overlay mode.
- 21a8140: Add option to toggle sorting

### Patch Changes

- cef00f8: Fix DOMException when the buttonSelector is empty string

## 1.3.11

### Patch Changes

- 2f11f65: Prevent Shopify theme's dropdown to overlap with ours
- 5dc0323: Upgrade SDK packages to include the fix for style override.
- e982e49: Set default `importantStyles:true` for `Shopify` preset to avoid style override.

## 1.3.10

### Patch Changes

- eaa6a34: Tweak design of overlay component:

  - Increase the font size in the search box.
  - Remove the input border and divide the search results from the input with one divider line.

## 1.3.9

### Patch Changes

- 9adadef: Upgrade SDK packages to include the fix for broken styling issues when integrating with Shopify themes.
- 18b2de9: Support `importantStyles` option to add !important to the provided styles in order to avoid CSS crashes from external CSS.
- 42ad2c4: Fix search input binding styling issue
- bf697fd: Update the script of the overlay mode to have effect on multiple elements queried by `buttonSelector`
- d5302b0: Upgrade SDK packages to include the fix for broken styling issues when integrating with Shopify themes.

## 1.3.8

### Patch Changes

- 3cc1c26: Hide powered by Sajari logo in Shopify.

## 1.3.7

### Patch Changes

- ac17274: Remove `inline-block` override causing styling of the search input broken in some themes.

## 1.3.6

### Patch Changes

- c6c8ce7: Upgrade `@sajari/react-search-ui@1.8.11` to include the fix for `formatLabel` returning `undefined` value if the input is empty and enable the reset button for a radio filter list.

## 1.3.5

### Patch Changes

- 2c597af: Upgrade SDK packages to fix empty results issue if an interface has a price filter.

## 1.3.4

### Patch Changes

- 6865892: Add support `textTransform` for filter options.

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
