# `@m2d/mermaid`

[![test](https://github.com/md2docx/mermaid/actions/workflows/test.yml/badge.svg)](https://github.com/md2docx/mermaid/actions/workflows/test.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/aa896ec14c570f3bb274/maintainability)](https://codeclimate.com/github/md2docx/mermaid/maintainability) [![codecov](https://codecov.io/gh/md2docx/mermaid/graph/badge.svg)](https://codecov.io/gh/md2docx/mermaid) [![Version](https://img.shields.io/npm/v/@m2d/mermaid.svg?colorB=green)](https://www.npmjs.com/package/@m2d/mermaid) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/@m2d/mermaid.svg)](https://www.npmjs.com/package/@m2d/mermaid) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@m2d/mermaid)

> 🧩 Plugin for [@m2d/core](https://www.npmjs.com/package/@m2d/core) that renders Mermaid diagrams and mindmaps from Markdown code blocks and converts them into DOCX-compatible SVG images.

---

## ✨ Features

- Supports `mermaid`, `mmd`, and `mindmap` code blocks.
- Converts diagrams to inline SVG for high-quality DOCX rendering.
- Compatible with the `mdast2docx` and `@m2d` plugin ecosystem.
- Fully customizable via [Mermaid config options](https://mermaid.js.org/configuration.html).
- Handles rendering quirks with default sane settings (e.g., `fontFamily`).

---

## 📦 Installation

```bash
pnpm install @m2d/mermaid
```

**_or_**

```bash
yarn add @m2d/mermaid
```

**_or_**

````bash
npm add @m2d/mermaid

---

## 📦 Usage

```ts
import { mermaidPlugin } from "@m2d/mermaid";
import { imagePlugin } from "@m2d/image";
import { toDocx } from "@m2d/core";

const converter = await toDocx({
  plugins: [mermaidPlugin(), imagePlugin()],
});

const docxBuffer = await converter.convert(`# Diagram\n\n\`\`\`mermaid\ngraph TD; A-->B;\`\`\``);
````

> You can also use `mindmap` or `mmd` as code block languages. The plugin will auto-adjust for Mermaid syntax quirks.

---

## ⚙️ Plugin Options

```ts
mermaidPlugin({
  mermaidConfig: {
    theme: "default",
    fontFamily: "Arial",
    // See all options: https://mermaid.js.org/configuration.html
  },
});
```

---

## 🧠 How It Works

- Scans for code blocks with language `mermaid`, `mmd`, or `mindmap`.
- Uses [Mermaid](https://mermaid.js.org) to render diagrams as SVG.
- Injects the SVG as an `mdast` node, ready for DOCX embedding.

---

## 📄 License

Licensed under the **MPL-2.0** License.

---

## ⭐ Support Us

If you find this useful:

- ⭐ Star [mdast2docx](https://github.com/md2docx/mdast2docx) on GitHub
- ❤️ Consider [sponsoring](https://github.com/sponsors/mayank1513)

---

<p align="center">Made with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a></p>
