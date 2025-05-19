import { IPlugin, Parent, Root, SVG, PhrasingContent, RootContent } from "@m2d/core";
import mermaid, { MermaidConfig } from "mermaid";

interface IMermaidPluginOptions {
  /**
   * Plugin options for configuring Mermaid rendering.
   *
   * You can pass a partial MermaidConfig object to customize rendering behavior.
   * For available options, refer to the Mermaid documentation:
   * @see https://mermaid.js.org/configuration.html
   */
  mermaidConfig?: MermaidConfig;
  /**
   * Optional cache for storing Mermaid source code and rendered SVGs.
   * This can be useful for debugging or caching purposes.
   */
  cache?: Record<string, Promise<{ svg: string }>>;
}

/**
 * Default Mermaid rendering configuration.
 *
 * We explicitly set `fontFamily` to "sans-serif" because Mermaid's default font stack
 * sometimes includes fonts that can cause rendering glitches or inconsistent diagrams.
 * Setting it ensures more stable and predictable output across platforms.
 *
 * @see https://mermaid.js.org/configuration.html#fontfamily
 */
const defaultMermaidConfig: MermaidConfig = {
  fontFamily: "sans-serif",
  suppressErrorRendering: true,
};

const mermaidCache: Record<string, Record<string, Promise<{ svg: string }>>> = {};

/**
 * Mermaid plugin for @m2d/core.
 * This plugin detects Mermaid or Mindmap code blocks and converts them into SVG nodes
 * that are later rendered as images in the generated DOCX document.
 */
export const mermaidPlugin: (options?: IMermaidPluginOptions) => IPlugin = options => {
  // Initialize Mermaid with user-provided and default config
  const finalConfig = { ...defaultMermaidConfig, ...options?.mermaidConfig };
  mermaid.initialize(finalConfig);

  const cache = Object.assign(options?.cache ?? {}, mermaidCache[JSON.stringify(finalConfig)]);

  const preprocess = (node: Root | RootContent | PhrasingContent) => {
    // Preprocess the AST to detect and cache Mermaid or Mindmap blocks
    (node as Parent).children?.forEach(preprocess);

    // Only process code blocks with a supported language tag
    if (node.type === "code" && /(mindmap|mermaid|mmd)/.test(node.lang ?? "")) {
      let value = node.value
        .split("\n")
        .map(line => line.trim())
        .join("\n");
      // Automatically prefix 'mindmap' if missing for mindmap blocks
      if (node.lang === "mindmap" && !value.startsWith("mindmap")) value = `mindmap\n${value}`;

      // Generate a unique ID for Mermaid rendering — must not start with a number
      const mId = `m${crypto.randomUUID()}`;

      try {
        cache[value] = cache[value] ?? mermaid.render(mId, value);

        // Create an extended MDAST-compatible SVG node
        const svgNode: SVG = {
          type: "svg",
          value: cache[value],
          // Store original Mermaid source in data for traceability/debug
          data: { mermaid: node.value },
        };

        // Replace the code block with a paragraph that contains the SVG
        Object.assign(node, {
          type: "paragraph",
          children: [svgNode],
          data: { alignment: "center" }, // center-align diagram
        });
      } catch (error) {
        /* v8 ignore next 2 Log error but continue gracefully */
        console.error(error);
      }
    }
  };

  return {
    /**
     * Processes block-level MDAST nodes.
     * Converts `code` blocks tagged as `mermaid`, `mmd`, or `mindmap` into DOCX-compatible SVG nodes.
     */
    preprocess,
  };
};
