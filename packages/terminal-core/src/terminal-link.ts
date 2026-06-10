<<<<<<< HEAD:src/terminal/terminal-link.ts
=======
// OSC 8 terminal hyperlink formatting with plain-text fallback.

/** Format a clickable terminal link when supported, otherwise return a readable fallback. */
>>>>>>> upstream/main:packages/terminal-core/src/terminal-link.ts
export function formatTerminalLink(
  label: string,
  url: string,
  opts?: { fallback?: string; force?: boolean },
): string {
  const esc = "\u001b";
  const safeLabel = label.replaceAll(esc, "");
  const safeUrl = url.replaceAll(esc, "");
<<<<<<< HEAD:src/terminal/terminal-link.ts
  const allow =
    opts?.force === true ? true : opts?.force === false ? false : Boolean(process.stdout.isTTY);
=======
  const allow = opts?.force === true ? true : opts?.force === false ? false : process.stdout.isTTY;
>>>>>>> upstream/main:packages/terminal-core/src/terminal-link.ts
  if (!allow) {
    return opts?.fallback ?? `${safeLabel} (${safeUrl})`;
  }
  return `\u001b]8;;${safeUrl}\u0007${safeLabel}\u001b]8;;\u0007`;
}
