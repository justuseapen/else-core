<<<<<<< HEAD
=======
/** Plain text segment accepted by embedding providers. */
>>>>>>> upstream/main
export type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};

<<<<<<< HEAD
=======
/** Base64 inline payload segment for multimodal embedding providers. */
>>>>>>> upstream/main
export type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};

<<<<<<< HEAD
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;

=======
/** Provider-neutral embedding input part. */
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;

/** Embedding input preserving legacy text plus optional structured parts. */
>>>>>>> upstream/main
export type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};

<<<<<<< HEAD
=======
/** Build a text-only embedding input while keeping callers on the structured API. */
>>>>>>> upstream/main
export function buildTextEmbeddingInput(text: string): EmbeddingInput {
  return { text };
}

<<<<<<< HEAD
export function isInlineDataEmbeddingInputPart(
=======
function isInlineDataEmbeddingInputPart(
>>>>>>> upstream/main
  part: EmbeddingInputPart,
): part is EmbeddingInputInlineDataPart {
  return part.type === "inline-data";
}

<<<<<<< HEAD
=======
/** Return true when an embedding request needs multimodal provider support. */
>>>>>>> upstream/main
export function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => isInlineDataEmbeddingInputPart(part));
}
