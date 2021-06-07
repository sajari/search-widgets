---
'@sajari/search-widgets': patch
---

Stop the click event from being triggered on the parent nodes. In most cases, we only want the click on the node (buttonSelector) to trigger the overlay modal to open rather than calling the script from themes.
