# @m2d/mermaid

## 1.1.3

### Patch Changes

- 55c8df9: fix: make idb optional parameter

## 1.1.2

### Patch Changes

- 39d2fb7: Move clean up function to initializer to avoid blocking the mermaid or image processing. Update core package to race promises to get the generated or cached data whichever is faster.

## 1.1.1

### Patch Changes

- 13df583: fix: account for mermaid config in the cache-key

  - moving low cost mermaid clean up outside cache, avoiding duplicate data caching to IndexedDB

## 1.1.0

### Minor Changes

- 90dd5a0: Implement caching using indexdb

## 1.0.1

### Patch Changes

- 028630d: feat: trim mermaid code lines only for diagram types where it is not critical.
- be458aa: fix: Do not trim mermaid charts

## 1.0.0

### Major Changes

- bb6c7fe: Plugin signature is upgraded as described here - https://github.com/md2docx/mdast2docx/discussions/15

### Patch Changes

- d135082: Add caching
- 01c9a9f: Use svg promises for optimization

## 0.0.3

### Patch Changes

- 0d972bf: suppressErrorRendering true by default

## 0.0.2

### Patch Changes

- 89ea8b4: Update Readme
- 16adc1f: Update metadata

## 0.0.1

### Patch Changes

- 98da0fb: Create only svg nodes. The actual rendering will be handled by the image plugin.
