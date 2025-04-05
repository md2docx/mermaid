import { IPlugin } from "@m2d/core";
import { InlineDocxNodes } from "@m2d/core/utils";
import type { Paragraph, Table } from "docx";
import mermaid, { MermaidConfig } from "mermaid";

interface IMermaidPluginOptions {
  mermaidConfig?: MermaidConfig;
}

const defaultMermaidConfig: MermaidConfig = {
  startOnLoad: false,
  fontFamily: "sans-serif",
  // theme: "default",
  // logLevel: 5,
  // securityLevel: "strict",
  // flowchart: {
  //   useMaxWidth: true,
  //   htmlLabels: true,
  //   curve: "linear",
  // },
  // flowchart: {
  //   useWidth:
  // },
};

/**
 * Mermaid plugin for @m2d/core.
 * This plugin provides support for custom mermaid transformation within Markdown content
 * during conversion to DOCX format.
 */
export const mermaidPlugin: (options?: IMermaidPluginOptions) => IPlugin = options => {
  mermaid.initialize({ ...defaultMermaidConfig, ...options?.mermaidConfig });
  return {
    /**
     * Converts mermaid code blocks to image nodes.
     */
    block: async (_docx, node) => {
      if (node.type === "code" && /(mindmap|mermaid|mmd)/.test(node.lang ?? "")) {
        if (node.lang === "mindmap" && !node.value.startsWith("mindmap"))
          node.value = `mindmap\n${node.value
            .split("\n")
            .map(line => `  ${line}`)
            .join("\n")}`;
        const { svg } = await mermaid.render(`a${crypto.randomUUID().split("-")[0]}`, node.value);
        Object.assign(node, {
          type: "image",
          url: `data:image/svg+xml;base64,${btoa(svg)}`,
        });
      }

      return [];
    },
  };
};
