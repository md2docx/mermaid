# `@m2d/mermaid`

[![Test](https://github.com/md2docx/mermaid/actions/workflows/test.yml/badge.svg)](https://github.com/md2docx/mermaid/actions/workflows/test.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/aa896ec14c570f3bb274/maintainability)](https://codeclimate.com/github/md2docx/mermaid/maintainability)
[![Code Coverage](https://codecov.io/gh/md2docx/mermaid/graph/badge.svg)](https://codecov.io/gh/md2docx/mermaid)
[![Version](https://img.shields.io/npm/v/@m2d/mermaid.svg?colorB=green)](https://www.npmjs.com/package/@m2d/mermaid)
[![Downloads](https://img.shields.io/npm/dm/@m2d/mermaid.svg)](https://www.npmjs.com/package/@m2d/mermaid)
![Minzipped](https://img.shields.io/bundlephobia/minzip/@m2d/mermaid)

> 🧠 A plugin for [`@m2d/core`](https://www.npmjs.com/package/@m2d/core) that transforms `mermaid`, `mmd`, and `mindmap` code blocks into high-quality inline SVGs, ready for DOCX, HTML, or future PDF export.
> ✨ Built with caching, configurability, and AI/automation-friendly hooks in mind.

---

## ✨ Why `@m2d/mermaid`?

This plugin is part of the [`mdast2docx`](https://mdast2docx.vercel.app/) ecosystem — a modular pipeline to convert Markdown (via MDAST) into richly formatted documents.

Whether you're using this in a generative AI pipeline, a Markdown editor, or a publishing workflow, `@m2d/mermaid` helps you render diagrams **just once**, cache the result smartly, and export it across formats.

---

## ⚡ Features at a Glance

- ✅ Supports `mermaid`, `mmd`, and `mindmap` code blocks.
- 🖼️ Converts diagrams into **inline SVGs** compatible with DOCX/HTML.
- 🧠 Smart **persistent caching** via IndexedDB and **deduplication** via in-memory layer.
- 🛠️ Fully configurable via [Mermaid config](https://mermaid.js.org/configuration.html).
- 💥 Handles rendering quirks (e.g. mindmaps, whitespace trimming).
- 🤖 Built-in hook to fix broken diagrams using **LLMs or custom logic**.
- 🧩 Seamless integration with `@m2d/core` and `mdast2docx` ecosystem.

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

```bash
npm add @m2d/mermaid
```

---

## 🚀 Quick Start

```ts
import { mermaidPlugin } from "@m2d/mermaid";
import { imagePlugin } from "@m2d/image";
import { toDocx } from "@m2d/core";

const converter = await toDocx({
  plugins: [mermaidPlugin(), imagePlugin()],
});

const docxBuffer = await converter.convert(`# Flow\n\n\`\`\`mermaid\ngraph TD; A-->B;\`\`\``);
```

✅ You can use `mindmap` or `mmd` code blocks too — the plugin handles them all.

---

## 🧙‍♀️ Plugin Options

```ts
mermaidPlugin({
  mermaidConfig: {
    theme: "default",
    fontFamily: "Arial",
    // See all options: https://mermaid.js.org/configuration.html
  },
  idb: true, // Enable IndexedDB caching (default: true)
  maxAgeMinutes: 60 * 24 * 30, // Optional cache expiry (default: 30 days)
  fixMermaid: (code, error) => {
    // Optional: auto-fix bad syntax using AI or heuristics
    return code.replace(/;/g, " --> ");
  },
});
```

---

## 🛠 How It Works

1. Looks for `code` blocks with `lang` = `mermaid`, `mmd`, or `mindmap`.
2. Cleans and normalizes the code (but leaves sensitive diagram types untouched).
3. Uses [Mermaid](https://mermaid.js.org) to generate an SVG.
4. Replaces the block with a centered `<svg>` node inside your MDAST.
5. Adds caching to speed up repeated renders:

   - 🧠 **In-memory**: avoids duplicate renders during the same session
   - 💾 **IndexedDB**: keeps results between sessions

---

## 🤖 Use with AI / Fixing Mermaid Diagrams

Let’s say your users generate Mermaid charts via LLMs (and they sometimes mess up):

```ts
mermaidPlugin({
  fixMermaid: async (code, error) => {
    const response = await fetch("/fix-diagram", {
      method: "POST",
      body: JSON.stringify({ code, error: error.message }),
    });
    return await response.text(); // New (hopefully fixed) diagram code
  },
});
```

📚 See [Mermaid docs](https://mermaid.js.org) for supported syntax and examples.

---

## 🧩 Part of the `@m2d` Ecosystem

This plugin works best when used with:

- [`@m2d/core`](https://www.npmjs.com/package/@m2d/core) – Orchestrates plugins and generates DOCX
- [`@m2d/image`](https://www.npmjs.com/package/@m2d/image) – Handles image conversion and embedding
- [`@m2d/html`](https://www.npmjs.com/package/@m2d/html) – Parses inline HTML into MDAST nodes

🌐 Try it live: [mdast2docx.vercel.app](https://mdast2docx.vercel.app)

---

## 🧼 Cache Cleanup

To avoid indexed-db bloat, the plugin:

- Automatically cleans up expired cache entries **after document export**.
- Ensures cleanup runs **only once per session** via a `cleanupDone` flag.
- Stores rendered diagrams by **language and content hash** to prevent duplicates.

---

## 📄 License

Licensed under the [MPL-2.0 License](https://www.mozilla.org/en-US/MPL/2.0/).

---

## 🤝 Contribute & Collaborate

Have an idea? Spotted a bug? Want to level up documentation?

- 💬 File issues or discussions on [GitHub](https://github.com/md2docx/mermaid)
- 📦 Submit PRs – small or big!
- ⭐ Star the project if you find it helpful

---

<p align="center">
  Made with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a> and contributors
</p>
