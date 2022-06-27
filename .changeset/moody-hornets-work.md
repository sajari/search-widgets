---
'@sajari/search-widgets': patch
---

Fix the issue when setting `options.results.viewType` doesn't work. It was because the code to set the default viewType was unwantedly removed during the refactor Sync State URL
