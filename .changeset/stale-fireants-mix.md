---
'@sajari/search-widgets': minor
---

Add support Summary props via the API:

```html
<div data-widget="search-results">
  <script type="application/json">
    {
      "options": {
        "input": {
          "mode": "suggestions"
        },
        "summary": {
          "suggest": true
        }
      }
    }
  </script>
</div>
```
