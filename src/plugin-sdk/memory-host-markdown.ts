<<<<<<< HEAD
=======
/**
 * Public SDK helpers for maintaining generated blocks inside Markdown files.
 */
>>>>>>> upstream/main
export type ManagedMarkdownBlockParams = {
  original: string;
  body: string;
  startMarker: string;
  endMarker: string;
  heading?: string;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

<<<<<<< HEAD
=======
function isLineWhitespace(value: string): boolean {
  return /^[\t \r\n]*$/.test(value);
}

/** Ensures generated Markdown content ends with exactly the caller-provided body plus newline. */
>>>>>>> upstream/main
export function withTrailingNewline(content: string): string {
  return content.endsWith("\n") ? content : `${content}\n`;
}

<<<<<<< HEAD
export function replaceManagedMarkdownBlock(params: ManagedMarkdownBlockParams): string {
  const headingPrefix = params.heading ? `${params.heading}\n` : "";
  const managedBlock = `${headingPrefix}${params.startMarker}\n${params.body}\n${params.endMarker}`;
  const existingPattern = new RegExp(
    `${params.heading ? `${escapeRegex(params.heading)}\\n` : ""}${escapeRegex(params.startMarker)}[\\s\\S]*?${escapeRegex(params.endMarker)}`,
    "m",
  );

  if (existingPattern.test(params.original)) {
    return params.original.replace(existingPattern, managedBlock);
=======
/** Replaces all existing managed blocks with one current block, or appends it if missing. */
export function replaceManagedMarkdownBlock(params: ManagedMarkdownBlockParams): string {
  const headingPrefix = params.heading ? `${params.heading}\n` : "";
  const managedBlock = `${headingPrefix}${params.startMarker}\n${params.body}\n${params.endMarker}`;
  const headingPattern = params.heading
    ? `${escapeRegex(params.heading)}(?:[ \t]*(?:\r\n|\n|\r))+[ \t]*`
    : "";
  const existingPattern = new RegExp(
    `${headingPattern}${escapeRegex(params.startMarker)}[\\s\\S]*?${escapeRegex(params.endMarker)}`,
    "g",
  );
  const matches = Array.from(params.original.matchAll(existingPattern));

  if (matches.length > 0) {
    let updated = "";
    let lastEnd = 0;
    matches.forEach((match, index) => {
      const matchStart = match.index ?? 0;
      const matchEnd = matchStart + match[0].length;
      const betweenMatches = params.original.slice(lastEnd, matchStart);
      if (index === 0) {
        updated += params.original.slice(0, matchStart);
        updated += managedBlock;
      } else if (!isLineWhitespace(betweenMatches)) {
        updated += betweenMatches;
      }
      lastEnd = matchEnd;
    });
    return updated + params.original.slice(lastEnd);
>>>>>>> upstream/main
  }

  const trimmed = params.original.trimEnd();
  if (trimmed.length === 0) {
    return `${managedBlock}\n`;
  }
  return `${trimmed}\n\n${managedBlock}\n`;
}
