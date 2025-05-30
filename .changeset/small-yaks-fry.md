---
"@m2d/mermaid": patch
---

Move clean up function to initializer to avoid blocking the mermaid or image processing. Update core package to race promises to get the generated or cached data whichever is faster.
