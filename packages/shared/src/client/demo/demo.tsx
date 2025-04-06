"use client";

import { unified } from "unified";
import md from "../../../../../sample.md?raw";
import remarkParse from "remark-parse";
import styles from "./demo.module.scss";
import { CodeDisplay } from "./code-display";
import { removePosition } from "unist-util-remove-position";
// skipcq: JS-R1001
import demoCode from "./demo.tsx?raw";
import { useState } from "react";
// import { remarkDocx } from "@m2d/remark-docx";
import { toDocx } from "mdast2docx";
import { mermaidPlugin } from "@m2d/mermaid";
import { imagePlugin } from "@m2d/image";

/** React live demo */
export function Demo() {
  const [loading, setLoading] = useState(false);
  const mdastProcessor = unified().use(remarkParse);

  const mdast = mdastProcessor.parse(md);

  removePosition(mdast);

  const downloadDocx = () => {
    setLoading(true);

    toDocx(
      mdast,
      {},
      {
        plugins: [mermaidPlugin(), imagePlugin()],
      },
    ).then(blob => {
      const url = URL.createObjectURL(blob as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-document.docx";
      link.click();
      URL.revokeObjectURL(url);
      setLoading(false);
    });
  };

  // console.log(docxProcessor.processSync(md));

  const code: { filename: string; code: string }[] = [
    { filename: "sample.md", code: md },
    { filename: "MDAST", code: JSON.stringify(mdast, null, 2) },
    { filename: "demo.tsx", code: demoCode },
  ];
  return (
    <div className={styles.demo}>
      <h1>MDAST (Markdown Abstract Syntax Tree) to DOCX</h1>
      <button className={styles.btn} disabled={loading} onClick={downloadDocx}>
        {loading ? "Downloading..." : "Download as DOCX"}
      </button>
      <CodeDisplay code={code} />
      {/* <pre>{JSON.stringify(mdast, null, 2)}</pre> */}
    </div>
  );
}
