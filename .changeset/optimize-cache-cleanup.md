---
"@m2d/mermaid": minor
---

Optimize cache cleanup by moving it to postprocess hook

- Move cache cleanup from initialization to postprocess hook
- Only run cleanup once per session with cleanupDone flag
- Prevent unnecessary cleanups on multiple renders