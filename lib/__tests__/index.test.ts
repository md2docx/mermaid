import { describe, it, vi } from "vitest";
import { toDocx } from "@m2d/core"; // Adjust path based on your setup
import { unified } from "unified";
import remarkParse from "remark-parse";
import fs from "fs";
import { mermaidPlugin } from "../src";

const markdown = fs.readFileSync("../sample.md", "utf-8");

/**
 * concurrently run unit tests.
 */
describe.concurrent("toDocx", () => {
  const mdast = unified().use(remarkParse).parse(markdown);

  it("should not have any console.log", async ({ expect }) => {
    const consoleSpy = vi.spyOn(console, "log");
    await toDocx(mdast, {}, { plugins: [mermaidPlugin()] });
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
