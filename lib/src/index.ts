import { IPlugin, Optional } from "@m2d/core";
import { MutableParaOptions } from "@m2d/core/utils";
import type { IImageOptions } from "docx";
import mermaid, { MermaidConfig } from "mermaid";

interface IDefaultMermaidPluginOptions {
  mermaidConfig: MermaidConfig;
  scale: number;
  imgType: "png" | "jpg" | "bmp" | "gif";
  paraProps: MutableParaOptions;
  maxW: number /** inch */;
  maxH: number /** inch */;
  dpi: number;
}

type IMermaidPluginOptions = Optional<Omit<IDefaultMermaidPluginOptions, "dpi">>;

const defaultMermaidConfig: MermaidConfig = {
  fontFamily: "sans-serif",
};

const defaultOptions: IDefaultMermaidPluginOptions = {
  mermaidConfig: defaultMermaidConfig,
  scale: 4,
  paraProps: {
    alignment: "center",
  },
  imgType: "png",
  // Assuming A4, portrait, and normal page margins
  maxW: 6.3,
  maxH: 9.7,
  dpi: 96,
};

const svgToBase64 = (svg: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(blob); // Automatically handles encoding
  });
};

const tightlyCropMermaidSvg = async (
  svgRaw: string,
  container: HTMLDivElement,
): Promise<{ svg: string; scale: number }> => {
  return new Promise((resolve, reject) => {
    container.innerHTML = svgRaw;
    const svgEl = container.querySelector("svg");

    if (!svgEl) return reject(new Error("No <svg> found"));

    requestAnimationFrame(() => {
      try {
        const bbox = svgEl.getBBox();

        const origW = parseFloat(getComputedStyle(svgEl).width) || 0;
        const origH = parseFloat(getComputedStyle(svgEl).height) || 0;

        const margin = 4;
        const x = bbox.x - margin;
        const y = bbox.y - margin;
        const croppedW = bbox.width + margin * 2;
        const croppedH = bbox.height + margin * 2;

        const finalW = origW > 0 ? Math.min(croppedW, origW) : croppedW;
        const finalH = origH > 0 ? Math.min(croppedH, origH) : croppedH;

        const clonedSvg = svgEl.cloneNode(true) as SVGSVGElement;
        clonedSvg.setAttribute("viewBox", `${x} ${y} ${croppedW} ${croppedH}`);
        clonedSvg.setAttribute("width", `${finalW}`);
        clonedSvg.setAttribute("height", `${finalH}`);
        clonedSvg.removeAttribute("style");

        const svg = new XMLSerializer().serializeToString(clonedSvg);
        svgEl.remove();
        resolve({ svg, scale: Math.min(croppedW / origW, croppedH / origH, 1) });
      } catch (err) {
        svgEl.remove();
        reject(err);
      }
    });
  });
};

const svgToImageProps = async (
  svg: string,
  container: HTMLDivElement,
  options: IDefaultMermaidPluginOptions,
): Promise<IImageOptions> => {
  const img = new Image();
  container.appendChild(img);
  const croppedSvg = await tightlyCropMermaidSvg(svg, container);
  const svgDataURL = await svgToBase64(croppedSvg.svg);
  img.src = svgDataURL;
  await new Promise(resolve => (img.onload = resolve));

  const width = img.width * options.scale;
  const height = img.height * options.scale;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  /* v8 ignore start - canvas is not available in JSDOM */
  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const data = canvas.toDataURL(`image/${options.imgType}`);

  img.remove();

  const scale = Math.min(
    ((options.maxW * options.dpi) / width) * croppedSvg.scale,
    ((options.maxH * options.dpi) / height) * croppedSvg.scale,
    1,
  );
  return {
    type: options.imgType,
    data,
    transformation: {
      width: width * scale,
      height: height * scale,
    },
  };
  /* v8 ignore stop */
};

/**
 * Mermaid plugin for @m2d/core.
 * This plugin provides support for custom mermaid transformation within Markdown content
 * during conversion to DOCX format.
 */
export const mermaidPlugin: (options?: IMermaidPluginOptions) => IPlugin = options_ => {
  const options = { ...defaultOptions, options_ };
  mermaid.initialize({ ...defaultMermaidConfig, ...options_?.mermaidConfig });
  const container = document.createElement("div");
  container.style = `height:${options.maxH}in;width:${options.maxW}in;position:absolute;left:-2500vw;`;
  document.body.appendChild(container);
  /** px/inch */
  options.dpi = parseFloat(getComputedStyle(container).width) / options.maxW;
  return {
    /**
     * Converts mermaid code blocks to image nodes.
     */
    block: async (docx, node, paraProps) => {
      if (node.type === "code" && /(mindmap|mermaid|mmd)/.test(node.lang ?? "")) {
        if (node.lang === "mindmap" && !node.value.startsWith("mindmap"))
          node.value = `mindmap\n${node.value}`;

        try {
          // id attribute can not start with a number
          const { svg } = await mermaid.render(`m${crypto.randomUUID()}`, node.value);

          Object.assign(node, { type: "" });

          return [
            new docx.Paragraph({
              children: [new docx.ImageRun(await svgToImageProps(svg, container, options))],
              ...paraProps,
              ...options.paraProps,
            }),
          ];
        } catch (error) {
          console.error(error);
        }
      }

      return [];
    },
  };
};
