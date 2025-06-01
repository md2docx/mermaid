import { IPlugin, Parent, Root, SVG, PhrasingContent, RootContent, Code } from "@m2d/core";
import mermaid, { MermaidConfig } from "mermaid";
import { simpleCleanup, createPersistentCache } from "@m2d/core/cache";

interface IMermaidPluginOptions {
  /**
   * Options for configuring Mermaid rendering.
   *
   * Pass a partial MermaidConfig object to customize behavior.
   * Refer to the Mermaid documentation for full configuration options:
   * @see https://mermaid.js.org/configuration.html
   */
  mermaidConfig?: MermaidConfig;

  /**
   * Optional fixer function to repair invalid Mermaid code before retrying render.
   */
  fixMermaid?: (mermaidCode: string, error: Error) => string;

  /** Enable IndexedDB-based caching. @default true */
  idb?: boolean;

  /** Clean up the entries that are not used for following minutes. @default 30 * 24 * 60 -- that is 30 days */
  maxAgeMinutes?: number;
}

/** Namespace used for persistent cache cleanup */
const NAMESPACE = "mmd";

/**
 * Default configuration for Mermaid rendering.
 *
 * Sets a fixed `fontFamily` ("sans-serif") to avoid inconsistent
 * rendering due to platform font differences.
 *
 * @see https://mermaid.js.org/configuration.html#fontfamily
 */
const defaultMermaidConfig: MermaidConfig = {
  fontFamily: "sans-serif",
  suppressErrorRendering: true,
};

/**
 * Mermaid plugin for @m2d/core.
 * Detects `mermaid`, `mmd`, and `mindmap` code blocks and converts them to SVG.
 * The resulting SVGs are later rendered as images in DOCX exports.
 */
export const mermaidPlugin: (options?: IMermaidPluginOptions) => IPlugin = options => {
  // Merge user config with defaults and initialize Mermaid
  const finalConfig = { ...defaultMermaidConfig, ...options?.mermaidConfig };
  mermaid.initialize(finalConfig);

  const maxAgeMinutes = options?.maxAgeMinutes ?? 30 * 24 * 60;
  let cleanupDone = false;

  const mermaidProcessor = async (value: string, _options: MermaidConfig) => {
    const mId = `m${crypto.randomUUID()}`; // Must not start with a number

    try {
      return await mermaid.render(mId, value);
    } catch (error) {
      /* v8 ignore next 8 Log error but continue gracefully */
      console.warn(error); // Log and optionally retry
      if (options?.fixMermaid) {
        try {
          return await mermaid.render(mId, options.fixMermaid(value, error as Error));
        } catch (error1) {
          console.warn(error1);
        }
      }
    }
  };

  const preprocess = (node: Root | RootContent | PhrasingContent) => {
    // Recursively walk the AST
    (node as Parent).children?.forEach(preprocess);

    // Replace supported code blocks with async SVG nodes
    if (node.type === "code" && /(mindmap|mermaid|mmd)/.test(node.lang ?? "")) {
      let value = node.value;

      // Add missing "mindmap" prefix if needed
      if (node.lang === "mindmap" && !value.startsWith("mindmap")) {
        value = `mindmap\n${value}`;
      }

      // Normalize whitespace unless the diagram type is known to be sensitive
      if (!/^mindmap|gantt|gitGraph|timeline/i.test(value)) {
        value = value
          .split("\n")
          .map(line => line.trim())
          .join("\n");
      }
      const svgNode: SVG = {
        type: "svg",
        value: createPersistentCache(
          mermaidProcessor,
          NAMESPACE,
          ["type", "lang"],
          options?.idb ?? true,
        )(value, finalConfig),
        data: { mermaid: value }, // Preserve original source
      };

      Object.assign(node, {
        type: "paragraph",
        children: [svgNode],
        data: { alignment: "center" }, // Center-align diagram
      });
    }
  };

  return {
    /**
     * Transforms supported code blocks into centered SVGs for DOCX output.
     */
    preprocess,
    /** clean up IndexedDB once the document is packed */
    postprocess: () => {
      if ((options?.idb ?? true) && !cleanupDone) {
        cleanupDone = true;
        simpleCleanup(maxAgeMinutes, NAMESPACE);
      }
    },
  };
};
