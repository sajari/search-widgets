# Configuration reference

Search widgets are discrete blocks of JSON code that utilize the [Sajari React SDK](https://react.docs.sajari.com/). The following configuration properties are available to customize the widget:

| Name                   | Type                                                                   | Default   | Description                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pipeline`             | `string (required)`                                                    | `_`       | The pipeline configuration. See [Pipeline overview](https://docs.sajari.com/developer-guide/pipelines/overview/).                                      |
| `account`              | `string (required)`                                                    | `_`       | The account configuration (available in the credentials section in the Sajari admin interface).                                                        |
| `collection`           | `string (required)`                                                    | `_`       | The collection to query (available in the credentials section in the Sajari admin interface).                                                          |
| `endpoint`             | `string`                                                               | `_`       | The endpoint configuration.                                                                                                                            |
| `preset`               | `'shopify'` \| `'website'` \| `''`                                     | `''`      | The collection template. The set value affects the default values of properties such as `buttonSelector`.                                              |
| `tracking`             | `'click'` \| `'posneg'`                                                | `'click'` | Enable tracking to give you insights into the search behavior of your users and how your content is performing.                                        |
| `variables`            | [`Variables`](#Variables)                                              | `_`       | Define simple key -> value pair object used for every search request. The configuration is specified as [Variables](#Variables) properties.            |
| `config`               | [`Config`](#Config)                                                    | `_`       | Defines mapping between key/value pair params to be sent with each and every request .The configuration is specified as [Config](#Config) properties.  |
| `fields`               | [`FieldDictionary`](#FieldDictionary)                                  | `_`       | Map fields in your data to the required fields to display in the UI. The configuration is specified as [FieldDictionary](#FieldDictionary) properties. |
| `defaultFilter`        | `string`                                                               | `_`       | A default filter to apply to all search requests.                                                                                                      |
| `currency`             | `string`                                                               | `'USD'`   | The currency code to use for any formatted price values.                                                                                               |
| `theme`                | `Theme`                                                                | `_`       | Set basic color options for the interface. The configuration is specified as [Theme](#Theme) properties.                                               |
| `customClassNames`     | [`object`](https://react.docs.sajari.com/styling#available-classnames) | `_`       | Add CSS class names to components. See [Available className](https://react.docs.sajari.com/styling#available-classnames).                              |
| `disableDefaultStyles` | `boolean`                                                              | `false`   | Disable the default styles of components.                                                                                                              |
| `importantStyles`      | `boolean`                                                              | `true`    | Add `!important` to the provided styles to override any CSS clashes that usually result in strange styling.                                            |

As being said, every widget has a set of basic configuration properties and is defined based on the following structure:

```HTML
<div data-widget="widget-name">
  <script type="application/json">
    {
      "account": "1603163345448404241",
      "collection": "sajari-test-fashion2",
      "pipeline": "query",
      ...
    }
  </script>
</div>
<script async src="https://cdn.sajari.com/embed/1/loader.js"></script>
```

## Search Results Widget

The search result widget displays search results to the user on a search result page. The following options can be configured when creating the search results widget.

| Name      | Type                                            | Default | Description                                                                                                  |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `filters` | [`Filter[]`](#filter)                           | `_`     | Define a list of active filters. The configuration is specified as an array of [Filter](#filter) properties. |
| `options` | [`SearchResultsOptions`](#searchresultsoptions) | `_`     | Specific configuration options.                                                                              |

### Filter

The `Filter` object defines options to allow refining of search results. The options vary from a given type but all types share following basic properties:

| Name    | Type                                                                                                                                                                                                    | Default  | Description                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------- |
| `name`  | `string`                                                                                                                                                                                                | `_`      | The name of a given Filter. |
| `title` | `string`                                                                                                                                                                                                | `_`      | Title of the filter.        |
| `type`  | [`'list'`](#list-properties) \| [`'color'`](#color-properties) \| [`'rating'`](#rating-properties) \| [`'tabs'`](#tab-properties) \| [`'select'`](#select-properties) \| [`'range'`](#range-properties) | `'list'` | Type of the filter.         |

#### List properties

Exclusive props if type is `list`.

| Name            | Type                                                                                               | Default                                        | Description                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field`         | `string`                                                                                           | `_`                                            | A field in schema, used if `count` = true.                                                                                                                                            |
| `count`         | `boolean`                                                                                          | `true if no options specified.`                | Map to a field which aims to perform a count aggregate.                                                                                                                               |
| `options`       | `object`                                                                                           | `_`                                            | Dictionary of name -> filter pairs, used if `count` = false.                                                                                                                          |
| `multi`         | `boolean`                                                                                          | `true`                                         | Multiple selections allowed.                                                                                                                                                          |
| `array`         | `boolean`                                                                                          | `false`                                        | Whether the response of the field is an array. This setting is only applicable if `count` is set.                                                                                     |
| `group`         | `string`                                                                                           | `false`                                        | A group name, for grouping multiple filters together using [ARRAY_MATCH](https://docs.sajari.com/user-guide/integrating-search/filters/)                                              |
| `limit`         | `number`                                                                                           | `10`                                           | Maximum number of items to initially show. Maximum is 100.                                                                                                                            |
| `searchable`    | `boolean`                                                                                          | `true if the number of options exceeds limit.` | If true, display an input for searching through items.                                                                                                                                |
| `placeholder`   | `string`                                                                                           | `'Search'`                                     | Placeholder for search input.                                                                                                                                                         |
| `pinSelected`   | `boolean`                                                                                          | `true if the number of options exceeds limit.` | Pin selected items to the top of the list.                                                                                                                                            |
| `sort`          | `'count'` \| `'alpha'` \| `'none'`                                                                 | `'count'`                                      | How to sort the items. 'alpha' stands for 'alphanumeric' meaning to sort the items based on label alphabetically, 'count' to sort based on count, 'none' to skip the sorting process. |
| `sortAscending` | `boolean`                                                                                          | `true if sort is not 'count'.`                 | Whether to sort in ascending order.                                                                                                                                                   |
| `format`        | `'default'` \| `'price'`                                                                           | `'default'`                                    | How to format the values.                                                                                                                                                             |
| `hideCount`     | `boolean`                                                                                          | `false`                                        | Hide total items count.                                                                                                                                                               |
| `includes`      | `string[]`                                                                                         | `_`                                            | Selected options will be displayed as filter options. Used if `count` = true.                                                                                                         |
| `excludes`      | `string[]`                                                                                         | `_`                                            | Selected options will not be displayed as filter options. Used if `count` = true.                                                                                                     |
| `prefixFilter`  | `string`                                                                                           | `_`                                            | If specified, only options that exactly match the prefix will be shown. The prefix will be removed from the option displayed. Used if `count` = true.                                 |
| `textTransform` | `'normal-case'` \| `'uppercase'` \| `'lowercase'` \| `'capitalize'` \| `'capitalize-first-letter'` | `'normal-case'`                                | Control the capitalization of text options.                                                                                                                                           |

<details>
<summary>Click to expand example</summary>

```json
{
  "name": "brand",
  "field": "brand",
  "title": "Brand"
}
```

By default, it will perform a count aggregate over the field `brand` to return a list of filter options. The list can be filtered via `includes`, `excludes` or `prefixFilter`.

However, we can manually specify the options:

```json
{
  "name": "category",
  "count": false,
  "title": "category",
  "multi": false,
  "hideCount": true,
  "options": {
    "Appliances": "level1 ~ 'appliances'",
    "Audio": "level1 ~ 'audio'",
    "Cell phones": "level1 ~ 'Cell Phones'",
    "Video games": "level1 ~ 'Video games'"
  }
}
```

See the example in [Codesandbox](https://codesandbox.io/s/list-filter-87xhw).

</details>

#### Color properties

Exclusive props if type is `color`.

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

<details>
<summary>Click to expand example</summary>

```json
{
  "name": "color",
  "field": "imageTags",
  "title": "Color",
  "type": "color"
}
```

See the example in [Codesandbox](https://codesandbox.io/s/color-and-rating-filter-tkf52).

</details>

#### Rating properties

Exclusive props if type is `rating`.

| Name        | Type      | Default | Description             |
| ----------- | --------- | ------- | ----------------------- |
| `hideCount` | `boolean` | `false` | Hide total items count. |

<details>
<summary>Click to expand example</summary>

```json
{
  "name": "rating",
  "field": "rating",
  "title": "Rating",
  "type": "rating"
}
```

See the example in [Codesandbox](https://codesandbox.io/s/color-and-rating-filter-tkf52).

</details>

#### Tabs properties

Exclusive props if type is `tabs`.

| Name            | Type                                                                                               | Default                         | Description                                                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field`         | `string`                                                                                           | `_`                             | A field in schema, used if `count` = true.                                                                                                                                              |
| `count`         | `boolean`                                                                                          | `true if no options specified.` | Map to a field which aims to perform a count aggregate.                                                                                                                                 |
| `options`       | `object`                                                                                           | `_`                             | Dictionary of name -> filter pairs.                                                                                                                                                     |
| `multi`         | `boolean`                                                                                          | `true`                          | Multiple selections allowed.                                                                                                                                                            |
| `array`         | `boolean`                                                                                          | `false`                         | Whether the response of the field is an array. This setting is only applicable if `count` is set.                                                                                       |
| `group`         | `string`                                                                                           | `false`                         | A group name, for grouping multiple filters together using [ARRAY_MATCH](https://docs.sajari.com/user-guide/integrating-search/filters/)                                                |
| `limit`         | `number`                                                                                           | `10`                            | Maximum number of items to initially show. Maximum is 100.                                                                                                                              |
| `sort`          | `'count'` \| `'alpha'` \| `'none'`                                                                 | `'count'`                       | How to sort the items. `'alpha'` stands for 'alphanumeric' meaning to sort the items based on label alphabetically, 'count' to sort based on count, 'none' to skip the sorting process. |
| `sortAscending` | `boolean`                                                                                          | `true if sort is not 'count'.`  | Whether to sort in ascending order.                                                                                                                                                     |
| `format`        | `'default'` \| `'price'`                                                                           | `'default'`                     | How to format the values.                                                                                                                                                               |
| `hideCount`     | `boolean`                                                                                          | `false`                         | Hide total items count.                                                                                                                                                                 |
| `includes`      | `string[]`                                                                                         | `_`                             | Selected options will be displayed as filter options. Used if `count` = true.                                                                                                           |
| `excludes`      | `string[]`                                                                                         | `_`                             | Selected options will not be displayed as filter options. Used if `count` = true.                                                                                                       |
| `prefixFilter`  | `string`                                                                                           | `_`                             | If specified, only options that exactly match the prefix will be shown. The prefix will be removed from the option displayed. Used if `count` = true.                                   |
| `textTransform` | `'normal-case'` \| `'uppercase'` \| `'lowercase'` \| `'capitalize'` \| `'capitalize-first-letter'` | `'normal-case'`                 | Control the capitalization of text options.                                                                                                                                             |

<details>
<summary>Click to expand example</summary>

```json
{
  "name": "category",
  "field": "level1",
  "title": "Category",
  "type": "tabs"
}
```

See the example in [Codesandbox](https://codesandbox.io/s/tabs-filter-b4qom).

</details>

#### Select properties

Exclusive props if type is `select`.

| Name            | Type                                                                                               | Default                         | Description                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field`         | `string`                                                                                           | `_`                             | A field in schema, used if `count` = true.                                                                                                                                            |
| `count`         | `boolean`                                                                                          | `true if no options specified.` | Map to a field which aims to perform a count aggregate.                                                                                                                               |
| `options`       | `object`                                                                                           | `_`                             | Dictionary of name -> filter pairs.                                                                                                                                                   |
| `multi`         | `boolean`                                                                                          | `true`                          | Multiple selections allowed.                                                                                                                                                          |
| `array`         | `boolean`                                                                                          | `false`                         | Whether the response of the field is an array. This setting is only applicable if `count` is set.                                                                                     |
| `group`         | `string`                                                                                           | `false`                         | A group name, for grouping multiple filters together using [ARRAY_MATCH](https://docs.sajari.com/user-guide/integrating-search/filters/)                                              |
| `limit`         | `number`                                                                                           | `10`                            | Maximum number of items to initially show. Maximum is 100.                                                                                                                            |
| `sort`          | `'count'` \| `'alpha'` \| `'none'`                                                                 | `'count'`                       | How to sort the items. 'alpha' stands for 'alphanumeric' meaning to sort the items based on label alphabetically, 'count' to sort based on count, 'none' to skip the sorting process. |
| `sortAscending` | `boolean`                                                                                          | `true if sort is not 'count'.`  | Whether to sort in ascending order.                                                                                                                                                   |
| `format`        | `'default'` \| `'price'`                                                                           | `'default'`                     | How to format the values.                                                                                                                                                             |
| `hideCount`     | `boolean`                                                                                          | `false`                         | Hide total items count.                                                                                                                                                               |
| `includes`      | `string[]`                                                                                         | `_`                             | Selected options will be displayed as filter options. Used if `count` = true.                                                                                                         |
| `excludes`      | `string[]`                                                                                         | `_`                             | Selected options will not be displayed as filter options. Used if `count` = true.                                                                                                     |
| `prefixFilter`  | `string`                                                                                           | `_`                             | If specified, only options that exactly match the prefix will be shown. The prefix will be removed from the option displayed. Used if `count` = true.                                 |
| `textTransform` | `'normal-case'` \| `'uppercase'` \| `'lowercase'` \| `'capitalize'` \| `'capitalize-first-letter'` | `'normal-case'`                 | Control the capitalization of text options.                                                                                                                                           |

<details>
<summary>Click to expand example</summary>

```json
{
  "name": "category2",
  "field": "level2",
  "title": "Category",
  "type": "select"
}
```

See the example in [Codesandbox](https://codesandbox.io/s/select-filter-2egs3).

</details>

#### Range properties

Exclusive props if type is `range`.

| Name         | Type                     | Default               | Description                                                                                                                              |
| ------------ | ------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `field`      | `string`                 | `_`                   | A field in schema, used if count = true.                                                                                                 |
| `group`      | `string`                 | `false`               | A group name, for grouping multiple filters together using [ARRAY_MATCH](https://docs.sajari.com/user-guide/integrating-search/filters/) |
| `initial`    | `[number, number]`       | `_`                   | The initial value.                                                                                                                       |
| `aggregate`  | `boolean`                | `true`                | If true, set value for min and max from the backend response.                                                                            |
| `min`        | `number`                 | `0`                   | The min value of the filter.                                                                                                             |
| `max`        | `number`                 | `aggregate ? 0 : 100` | The max value of the filter.                                                                                                             |
| `format`     | `'default'` \| `'price'` | `'default'`           | How to format the values.                                                                                                                |
| `showInputs` | `boolean`                | `false`               | Show inputs.                                                                                                                             |
| `steps`      | `number`                 | `_`                   | An array of custom steps to use. This will override step.                                                                                |
| `tick`       | `number`                 | `_`                   | The interval to show small ticks.                                                                                                        |
| `ticks`      | `number[]`               | `_`                   | An array of custom ticks to use. This will override tick.                                                                                |

<details>
<summary>Click to expand example</summary>

```json
{
  "name": "price",
  "field": "price",
  "title": "Price",
  "type": "range"
}
```

By default, the `max` and `min` value are set from an aggregation operation. However, we can manually define the min-max range and the intial value.

```json
{
  "name": "price",
  "field": "price",
  "title": "Price",
  "type": "range",
  "aggregate": false,
  "min": 0,
  "max": 2000,
  "initial": [200, 500]
}
```

See the example in [Codesandbox](https://codesandbox.io/s/range-filter-ctbvf).

</details>

### SearchResultsOptions

| Name             | Type                                                           | Default                                                                                      | Description                                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resultsPerPage` | `ResultsPerPageProps`                                          | `{options: [15, 25, 50, 100]}`                                                               | Options of ResultsPerPage component used to capture user input for how many results displayed per page. See [ResultsPerPage props](https://react.docs.sajari.com/search-ui/resultsperpage#props).                  |
| `sorting`        | `SortingProps`                                                 | `_`                                                                                          | Options of Sorting component used to capture user input on how to sort search results. See [Sorting props](https://react.docs.sajari.com/search-ui/sorting#props).                                                 |
| `input`          | `InputProps & {hide: boolean, position: 'top' \| 'aside'}`     | `{mode: 'instant', position: 'aside'}`                                                       | Options of Input component used to capture query input via a text field. It can also provide suggestions, typeahead and instant search modes. See [Input props](https://react.docs.sajari.com/search-ui/**input**) |
| `results`        | `ResultsProps`                                                 | `{imageAspectRatio: {grid: 1, list: 1}, imageObjectFit: {grid: 'cover', list: 'container'}}` | Options of Results component displaying result response from a search query. See [Results props](https://react.docs.sajari.com/search-ui/results#props).                                                           |
| `pagination`     | `PaginationProps`                                              | `_`                                                                                          | Options of Pagination component allowing the user to change the current page. See [Pagination props](https://react.docs.sajari.com/components/pagination#props).                                                   |
| `mode`           | [`'standard'`](#standard-mode) \| [`'overlay'`](#overlay-mode) | `'standard'`                                                                                 | Control the display of the search results. While the `standard` mode is for displaying the search results on a page content, the `overlay` mode places the search results in the middle of an overlay screen.      |

#### Standard properties

Exclusive props if mode is `standard`.

| Name        | Type                                | Default    | Description                                                                                                                                                         |
| ----------- | ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'syncURL'` | `'none'` \| `'replace'` \| `'push'` | `'push'`   | Keep the search state in the URL if the option is not `none`. While `replace` prevent adding a new URL entry into the `history` stack, `push` will do the opposite. |
| `urlParams` | `{q: string}`                       | `{q: 'q'}` | A key -> value pair object maps the URL params to initial values for the search. `q` defines the URL param for the initial search query.                            |

<details>
<summary>Click to expand example</summary>

```HTML
<div data-widget="search-results">
  <script type="application/json">
    {
      "account": "1594153711901724220",
      "collection": "bestbuy",
      "pipeline": "query",
      "fields": {
        "title": "name",
        "subtitle": "brand",
        "url": "https://www.bestbuy.com/products/${id}"
      },
      "filters": [
        {
          "name": "brand",
          "field": "brand",
          "title": "Brand",
          "searchable": true
        },
        {
          "name": "category",
          "field": "level1",
          "title": "Category",
          "searchable": true
        },
        {
          "name": "color",
          "field": "imageTags",
          "title": "Color",
          "type": "color"
        },
        {
          "name": "rating",
          "field": "rating",
          "title": "Rating",
          "type": "rating"
        },
        {
          "name": "price",
          "field": "price",
          "title": "Price",
          "type": "range"
        }
      ]
    }
  </script>
</div>
<script async src="https://cdn.sajari.com/embed/1/loader.js"></script>
```

See the example in [Codesandbox](https://codesandbox.io/s/standard-mode-search-results-widget-shgnj).

</details>

#### Overlay properties

Exclusive props if mode is `overlay`.

| Name             | Type                   | Default                                                                  | Description                                                                                                                                   |
| ---------------- | ---------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `buttonSelector` | `string` \| `string[]` | `['form[action="/search"]', 'a[href="/search"]'] if preset is 'shopify'` | A single or a list of CSS selector of elements used to trigger the overlay dialog to open.                                                    |
| `inputSelector`  | `string`               | `_`                                                                      | If defined, it will take the current value of the input to be the inital search query after the overlay diable is open.                       |
| `ariaLabel`      | `string`               | `'Open search'`                                                          | ARIA label for the `buttonSelector` element.                                                                                                  |
| `defaultOpen`    | `boolean`              | `false`                                                                  | If true, the modal will open.                                                                                                                 |
| `modal`          | `ModalProps`           | `_`                                                                      | Options for the dialog window holding the search results interface. See [Modal props](https://react.docs.sajari.com/search-ui/results#props). |

<details>
<summary>Click to expand example</summary>

```HTML
<div data-widget="overlay">
  <script type="application/json">
    {
      "account": "1594153711901724220",
      "collection": "bestbuy",
      "pipeline": "query",
      "fields": {
        "title": "name",
        "subtitle": "brand",
        "url": "https://www.bestbuy.com/products/${id}"
      },
      "filters": [
        {
          "name": "brand",
          "field": "brand",
          "title": "Brand",
          "searchable": true
        },
        {
          "name": "category",
          "field": "level1",
          "title": "Category",
          "searchable": true
        },
        {
          "name": "color",
          "field": "imageTags",
          "title": "Color",
          "type": "color"
        },
        {
          "name": "rating",
          "field": "rating",
          "title": "Rating",
          "type": "rating"
        },
        {
          "name": "price",
          "field": "price",
          "title": "Price",
          "type": "range"
        }
      ],
      "options": {
        "mode": "overlay",
        "buttonSelector": "#button"
      }
    }
  </script>
</div>
<script async src="https://cdn.sajari.com/embed/1/loader.js"></script>
```

See the example in [Codesandbox](https://codesandbox.io/s/overlay-mode-search-results-widget-unv1n).

</details>

## Takeover Search Input Widget

The Takeover Search Input widget allows users to inject Sajari search experience into the existing input while keeping the current appearance. The following options can be configured when creating the Takeover Search Input widget.

| Name                      | Type                                                            | Default                                                               | Description                                                                                                 |
| ------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `selector`                | `string`                                                        | `'form[action="/search"] input[name="q"]' if the preset is 'shopify'` | The CSS selector of the input being taken over.                                                             |
| `mode`                    | `'standard'` \| `'typeahead'` \| `'suggestions'` \| `'results'` | `'results'`                                                           | The mode of the input. For details, see [Input props](https://react.docs.sajari.com/search-ui/input#props). |
| `omittedElementSelectors` | `string` \| `string[]`                                          | `_`                                                                   | A single or a list of CSS selector of elements to be removed when the widget has mounted.                   |

<details>
<summary>Click to expand example</summary>

```HTML
<div data-widget="search-input-binding">
  <script type="application/json">
    {
      "account": "1594153711901724220",
      "collection": "bestbuy",
      "pipeline": "query",
      "selector": "#search-input",
      "mode": "results"
    }
  </script>
</div>
<script async src="https://cdn.sajari.com/embed/1/loader.js"></script>
```

See the example in [Codesandbox](https://codesandbox.io/s/takeover-input-widget-76okt).

</details>

## Search Input Widget

The search input widget is typically used in a global template and positioned in the header of the page. It renders a search input field. The following options can be configured when creating the Search Input Widget.

| Name       | Type                                                            | Default                                | Description                                                                                                                                                                |
| ---------- | --------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`     | `'standard'` \| `'typeahead'` \| `'suggestions'` \| `'results'` | `'suggestions'`                        | The mode of the input. For details, see [Input props](https://react.docs.sajari.com/search-ui/input#props).                                                                |
| `redirect` | `{url: string, queryParamName: string}`                         | `{url: 'search', queryParamName: 'q'}` | Options to set the redirect URL and the name of the search query param, normally, the destination is where the [Search Results Widget](#search-results-widget) is located. |

<details>
<summary>Click to expand example</summary>

```HTML
<div data-widget="search-input">
  <script type="application/json">
    {
      "account": "1594153711901724220",
      "collection": "bestbuy",
      "pipeline": "query",
      "selector": "#search-input",
      "mode": "suggestions",
      "redirect": {
        "url": "search.html",
        "queryParamName": "q"
      }
    }
  </script>
</div>
<script async src="https://cdn.sajari.com/embed/1/loader.js"></script>

```

See the example in [Codesandbox](https://codesandbox.io/s/search-input-widget-mui1w).

</details>

## Common Config Objects

### Variables

The Variables is a simple key -> value pair object used for every search request. The proprties will vary based on your [pipeline configuration](#Config) but the most common implementations will use the following:

Value types can be `string | string[] | number | boolean`.

| Name             | Type     | Default       | Description                                    |
| ---------------- | -------- | ------------- | ---------------------------------------------- |
| `q`              | `string` | `_`           | The search query.                              |
| `q.override`     | `string` | `_`           |                                                |
| `q.suggestions`  | `string` | `_`           | The autocomplete options for the search query. |
| `filter`         | `string` | `'_id != ""'` | Default filter to apply.                       |
| `resultsPerPage` | `number` | `15`          | How many results to display per page.          |
| `page`           | `number` | `1`           | Which page to display.                         |
| `maxSuggestions` | `number` | `10`          | How many autocomplete suggestions per search.  |

### Config

The `Config` object defines mapping between key/value pair params to be sent with each and every request.

| Name                  | Type     | Default            | Description                                                      |
| --------------------- | -------- | ------------------ | ---------------------------------------------------------------- |
| `qParam`              | `string` | `'q'`              | The key that includes a search query.                            |
| `qOverrideParam`      | `string` | `'q.override'`     |                                                                  |
| `qSuggestionsParam`   | `string` | `'q.suggestions'`  | The key that includes autocomplete options for the search query. |
| `resultsPerPageParam` | `string` | `'resultsPerPage'` | The key for how many results to display per page.                |
| `pageParam`           | `string` | `'page'`           | The key for which page to display.                               |
| `maxSuggestions`      | `number` | `'maxSuggestions'` | The key for how many autocomplete suggestions per search.        |

### FieldDictionary

The FieldDictionary object is used to map fields in your data to the required fields to display in the UI. By default, the fields for a website search collection are used.

| Name            | Type     | Default           | Description                                                                                                                                                                                                                             |
| --------------- | -------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | `string` | `'_id'`           | Unique identifier for the record.                                                                                                                                                                                                       |
| `url`           | `string` | `'url'`           | URL for the record, required for links in results.                                                                                                                                                                                      |
| `title`         | `string` | `'title'`         | The main title for the result.                                                                                                                                                                                                          |
| `subtitle`      | `string` | `'url'`           | The subtitle. Often a brand, category, or the URL.                                                                                                                                                                                      |
| `description`   | `string` | `'description'`   | A description to display beneath the title and subtitle.                                                                                                                                                                                |
| `image`         | `string` | `'image'`         | An image, if applicable.                                                                                                                                                                                                                |
| `price`         | `string` | `'price'`         | A price, if applicable.                                                                                                                                                                                                                 |
| `originalPrice` | `string` | `'originalPrice'` | An original price, if applicable. If the value is more than price (or it's index if price & originalPrice are both arrays) then the original price will be displayed (with ~~strikethrough~~) and the current price highlighted in red. |
| `rating`        | `string` | `'rating'`        | A rating, if applicable.                                                                                                                                                                                                                |

### Theme

The Theme object is used to set basic color options for the UI. Currently this is only for the primary actions.

| Name     | Type                                                      | Default | Description                     |
| -------- | --------------------------------------------------------- | ------- | ------------------------------- |
| `colors` | `{primary: {base: string, text: string, active: string}}` | `_`     | Set colors for primary actions. |
