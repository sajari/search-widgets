---
'@sajari/search-widgets': patch
---

Fix `form.submit()` doesn't trigger submit event via `addEventListener('submit')` by using `form.requestSubmit` method.
