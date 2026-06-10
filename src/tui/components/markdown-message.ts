<<<<<<< HEAD
import { Container, Spacer } from "@mariozechner/pi-tui";
import { markdownTheme } from "../theme/theme.js";
import { HyperlinkMarkdown } from "./hyperlink-markdown.js";

=======
// Markdown message component renders markdown chat content in the TUI.
import { Container, Spacer } from "@earendil-works/pi-tui";
import { markdownTheme } from "../theme/theme.js";
import { HyperlinkMarkdown } from "./hyperlink-markdown.js";

// Shared markdown message wrapper with a leading spacer for chat-log rows.
>>>>>>> upstream/main
type MarkdownOptions = ConstructorParameters<typeof HyperlinkMarkdown>[4];

/** Container-backed markdown message that can update text in place. */
export class MarkdownMessageComponent extends Container {
  private body: HyperlinkMarkdown;

  constructor(text: string, y: number, options?: MarkdownOptions) {
    super();
    this.body = new HyperlinkMarkdown(text, 0, y, markdownTheme, options);
    this.addChild(new Spacer(1));
    this.addChild(this.body);
  }

  /** Updates the rendered markdown without replacing the component. */
  setText(text: string) {
    this.body.setText(text);
  }
}
