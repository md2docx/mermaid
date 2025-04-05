import { describe, it, vi } from "vitest";
import { toDocx } from "@m2d/core"; // Adjust path based on your setup
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import fs from "fs";
import { emojiPlugin } from "../src";

const markdown = fs.readFileSync("../sample.md", "utf-8");

/**
 * concurrently run unit tests.
 */
describe.concurrent("toDocx", () => {
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(markdown);

  it("should handle emoji", async ({ expect }) => {
    const docxBlob = await toDocx(mdast, {}, { plugins: [emojiPlugin()] });
    expect(docxBlob).toBeInstanceOf(Blob);
  });

  it("should not have any console.log", async ({ expect }) => {
    const consoleSpy = vi.spyOn(console, "log");
    await toDocx(mdast, {}, { plugins: [emojiPlugin()] });
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
