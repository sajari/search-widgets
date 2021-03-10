---
'@sajari/search-widgets': patch
---

Remove current events from button used to trigger the overlay modal to open. It's because the previous event might have the effect of changing the UI which can conflict with the modal transition.
