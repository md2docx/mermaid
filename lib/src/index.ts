import { IPlugin, SVG } from "@m2d/core";
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

/**
 * Mermaid plugin for @m2d/core.
 * This plugin detects Mermaid or Mindmap code blocks and converts them into SVG nodes
 * that are later rendered as images in the generated DOCX document.
 */
export const mermaidPlugin: (options?: IMermaidPluginOptions) => IPlugin = options => {
  // Initialize Mermaid with user-provided and default config
  mermaid.initialize({ ...defaultMermaidConfig, ...options?.mermaidConfig });

  return {
    /**
     * Processes block-level MDAST nodes.
     * Converts `code` blocks tagged as `mermaid`, `mmd`, or `mindmap` into DOCX-compatible SVG nodes.
     */
    block: async (_docx, node) => {
      // Only process code blocks with a supported language tag
      if (node.type === "code" && /(mindmap|mermaid|mmd)/.test(node.lang ?? "")) {
        // Automatically prefix 'mindmap' if missing for mindmap blocks
        if (node.lang === "mindmap" && !node.value.startsWith("mindmap"))
          node.value = `mindmap\n${node.value}`;

        // Generate a unique ID for Mermaid rendering — must not start with a number
        const mId = `m${crypto.randomUUID()}`;

        try {
          // Render Mermaid SVG from code content
          const { svg } = await mermaid.render(mId, node.value);

          // Create an extended MDAST-compatible SVG node
          const svgNode: SVG = {
            type: "svg",
            id: mId,
            value: svg,
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
          // Log error but continue gracefully
          console.error(error);
        }
      }

      // Always return empty since we’re mutating the node in-place
      return [];
    },
  };
};
