<<<<<<< HEAD
import { html } from "lit";
=======
// Control UI view renders connect command screen content.
import { html } from "lit";
import { t } from "../../i18n/index.ts";
>>>>>>> upstream/main
import { renderCopyButton } from "../chat/copy-as-markdown.ts";

async function copyCommand(command: string) {
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    // Best effort only; the explicit copy button provides visible feedback.
  }
}

export function renderConnectCommand(command: string) {
<<<<<<< HEAD
=======
  const copyLabel = t("overview.connection.copyCommand");
>>>>>>> upstream/main
  return html`
    <div
      class="login-gate__command"
      role="button"
      tabindex="0"
<<<<<<< HEAD
      title="Copy command"
      aria-label=${`Copy command: ${command}`}
=======
      title=${copyLabel}
      aria-label=${t("overview.connection.copyCommandAria", { command })}
>>>>>>> upstream/main
      @click=${async (e: Event) => {
        if ((e.target as HTMLElement | null)?.closest(".chat-copy-btn")) {
          return;
        }
        await copyCommand(command);
      }}
      @keydown=${async (e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }
        e.preventDefault();
        await copyCommand(command);
      }}
    >
      <code>${command}</code>
<<<<<<< HEAD
      ${renderCopyButton(command, "Copy command")}
=======
      ${renderCopyButton(command, copyLabel)}
>>>>>>> upstream/main
    </div>
  `;
}
