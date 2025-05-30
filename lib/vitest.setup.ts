import { vi } from "vitest";

// Mock createImageBitmap
globalThis.createImageBitmap = vi.fn(async () => {
  return {
    width: 100,
    height: 100,
    close: vi.fn(() => {}),
  };
});

// @ts-expect-error Mock getBBox (required for SVG operations)
SVGElement.prototype.getBBox = () => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
});

const mockFetch = vi.fn(async (url: string) => {
  if (url.endsWith(".svg")) {
    const svgText = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <circle cx="50" cy="50" r="40" stroke="green" fill="yellow" />
      </svg>
    `.trim();

    return {
      ok: true,
      status: 200,
      headers: {
        get: (header: string) => {
          if (header.toLowerCase() === "content-type") return "image/svg+xml";
          return null;
        },
      },
      text: async () => svgText,
      arrayBuffer: async () => new TextEncoder().encode(svgText).buffer,
    };
  }

  if (url.includes("example")) {
    return {
      ok: false,
      status: 404,
      headers: {
        get: (header: string) => {
          if (header.toLowerCase() === "content-type") return "image/png";
          return null;
        },
      },
      arrayBuffer: async () => new Uint8Array().buffer,
    };
  }

  // For PNG or other image mocks
  const fakePng = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG file signature
  return {
    ok: true,
    status: 200,
    headers: {
      get: (header: string) => {
        if (header.toLowerCase() === "content-type") return "image/png";
        return null;
      },
    },
    arrayBuffer: async () => fakePng.buffer,
  };
}) as any;

vi.stubGlobal("fetch", mockFetch);

globalThis.fetch = mockFetch;

// setupTests.ts or in your test file

globalThis.Image = class {
  _src = "";
  width = 100;
  height = 100;
  onload: (() => void) | null = null;
  onerror: ((err?: unknown) => void) | null = null;

  set src(value: string) {
    this._src = value;

    // simulate successful image load after a small delay
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 1);
  }

  get src() {
    return this._src;
  }
} as unknown as typeof Image;

const originalCreateElement = document.createElement;

document.createElement = vi.fn((tagName: string) => {
  if (tagName.toLowerCase() === "img") {
    const fakeImg: any = {
      _src: "",
      width: 100,
      height: 100,
      set src(value: string) {
        this._src = value;
        // Simulate async load
        setTimeout(() => this.onload?.(), 1);
      },
      get src() {
        return this._src;
      },
      onload: null,
      onerror: null,
    };
    return fakeImg;
  }

  return originalCreateElement.call(document, tagName);
});

vi.mock("@mermaid/core/cache", () => {
  return {
    __esModule: true,
    createPersistentCache: (mermaidProcessor: Function) => mermaidProcessor,
    simpleCleanup: () => null,
  };
});

(SVGElement.prototype as any).getComputedTextLength = () => 100; // or any fixed number

(HTMLCanvasElement.prototype as any).getContext = vi.fn(() => {
  return {
    drawImage: vi.fn(),
    toDataURL: vi.fn(() => "data:image/png;base64,fakepng"),
  };
});
