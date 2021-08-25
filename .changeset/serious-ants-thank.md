---
'@sajari/search-widgets': minor
---

Support `shopifyOptions` for Search Result Widget to determine whether to pull results for a specific collection.

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
