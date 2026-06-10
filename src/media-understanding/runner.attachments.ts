<<<<<<< HEAD
=======
// Runner attachment facade keeps media attachment normalization/cache creation
// available from the public runner module without exposing implementation files.
>>>>>>> upstream/main
import type { MsgContext } from "../auto-reply/templating.js";
import {
  MediaAttachmentCache,
  type MediaAttachmentCacheOptions,
  normalizeAttachments,
} from "./attachments.js";
import type { MediaAttachment } from "./types.js";

<<<<<<< HEAD
=======
/** Normalizes message context media fields for the media-understanding runner. */
>>>>>>> upstream/main
export function normalizeMediaAttachments(ctx: MsgContext): MediaAttachment[] {
  return normalizeAttachments(ctx);
}

<<<<<<< HEAD
=======
/** Creates the lazy attachment cache used by image, audio, video, and document providers. */
>>>>>>> upstream/main
export function createMediaAttachmentCache(
  attachments: MediaAttachment[],
  options?: MediaAttachmentCacheOptions,
): MediaAttachmentCache {
  return new MediaAttachmentCache(attachments, options);
}
