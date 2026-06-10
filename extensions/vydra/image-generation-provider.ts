<<<<<<< HEAD
import type { ImageGenerationProvider } from "openclaw/plugin-sdk/image-generation";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import {
  assertOkOrThrowHttpError,
  postJsonRequest,
  resolveProviderHttpRequestConfig,
} from "openclaw/plugin-sdk/provider-http";
import {
  DEFAULT_VYDRA_BASE_URL,
  DEFAULT_VYDRA_IMAGE_MODEL,
  downloadVydraAsset,
  extractVydraResultUrls,
  resolveVydraBaseUrlFromConfig,
  resolveVydraErrorMessage,
  resolveVydraResponseJobId,
  resolveVydraResponseStatus,
  waitForVydraJob,
=======
// Vydra provider module implements model/runtime integration.
import type { ImageGenerationProvider } from "openclaw/plugin-sdk/image-generation";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { assertOkOrThrowHttpError, postJsonRequest } from "openclaw/plugin-sdk/provider-http";
import {
  DEFAULT_VYDRA_IMAGE_MODEL,
  downloadVydraAsset,
  extractVydraResultUrls,
  resolveCompletedVydraPayload,
  resolveVydraGeneratedMediaMaxBytes,
  resolveVydraResponseJobId,
  resolveVydraResponseStatus,
  resolveVydraRequestContext,
>>>>>>> upstream/main
} from "./shared.js";

export function buildVydraImageGenerationProvider(): ImageGenerationProvider {
  return {
    id: "vydra",
    label: "Vydra",
    defaultModel: DEFAULT_VYDRA_IMAGE_MODEL,
    models: [DEFAULT_VYDRA_IMAGE_MODEL],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "vydra",
        agentDir,
      }),
    capabilities: {
      generate: {
        maxCount: 1,
        supportsSize: false,
        supportsAspectRatio: false,
        supportsResolution: false,
      },
      edit: {
        enabled: false,
        maxCount: 1,
        maxInputImages: 0,
        supportsSize: false,
        supportsAspectRatio: false,
        supportsResolution: false,
      },
    },
    async generateImage(req) {
      if ((req.inputImages?.length ?? 0) > 0) {
        throw new Error(
          "Vydra image generation currently supports text-to-image only in the bundled plugin.",
        );
      }
      if ((req.count ?? 1) > 1) {
        throw new Error("Vydra image generation supports at most one image per request.");
      }

<<<<<<< HEAD
      const auth = await resolveApiKeyForProvider({
        provider: "vydra",
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) {
        throw new Error("Vydra API key missing");
      }

      const fetchFn = fetch;
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveVydraBaseUrlFromConfig(req.cfg),
          defaultBaseUrl: DEFAULT_VYDRA_BASE_URL,
          allowPrivateNetwork: false,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
          },
          provider: "vydra",
          capability: "image",
          transport: "http",
=======
      const { fetchFn, baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        await resolveVydraRequestContext({
          cfg: req.cfg,
          agentDir: req.agentDir,
          authStore: req.authStore,
          capability: "image",
>>>>>>> upstream/main
        });

      const model = req.model?.trim() || DEFAULT_VYDRA_IMAGE_MODEL;
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}/models/${model}`,
        headers,
        body: {
          prompt: req.prompt,
          model: "text-to-image",
        },
        timeoutMs: req.timeoutMs,
        fetchFn,
        allowPrivateNetwork,
<<<<<<< HEAD
=======
        ssrfPolicy: req.ssrfPolicy,
>>>>>>> upstream/main
        dispatcherPolicy,
      });

      try {
        await assertOkOrThrowHttpError(response, "Vydra image generation failed");
        const submitted = await response.json();
<<<<<<< HEAD
        const completedPayload =
          resolveVydraResponseStatus(submitted) === "completed" ||
          extractVydraResultUrls(submitted, "image").length > 0
            ? submitted
            : await (() => {
                const jobId = resolveVydraResponseJobId(submitted);
                if (!jobId) {
                  throw new Error(
                    resolveVydraErrorMessage(submitted) ??
                      "Vydra image generation response missing job id",
                  );
                }
                return waitForVydraJob({
                  baseUrl,
                  jobId,
                  headers,
                  timeoutMs: req.timeoutMs,
                  fetchFn,
                  kind: "image",
                });
              })();
=======
        const completedPayload = await resolveCompletedVydraPayload({
          submitted,
          baseUrl,
          headers,
          timeoutMs: req.timeoutMs,
          fetchFn,
          kind: "image",
          missingJobIdMessage: "Vydra image generation response missing job id",
        });
>>>>>>> upstream/main
        const imageUrl = extractVydraResultUrls(completedPayload, "image")[0];
        if (!imageUrl) {
          throw new Error("Vydra image generation completed without an image URL");
        }
        const image = await downloadVydraAsset({
          url: imageUrl,
          kind: "image",
          timeoutMs: req.timeoutMs,
          fetchFn,
<<<<<<< HEAD
=======
          maxBytes: resolveVydraGeneratedMediaMaxBytes({ cfg: req.cfg, kind: "image" }),
>>>>>>> upstream/main
        });
        return {
          images: [
            {
              buffer: image.buffer,
              mimeType: image.mimeType,
              fileName: image.fileName,
            },
          ],
          model,
          metadata: {
            jobId:
              resolveVydraResponseJobId(completedPayload) ?? resolveVydraResponseJobId(submitted),
            imageUrl,
            status: resolveVydraResponseStatus(completedPayload) ?? "completed",
          },
        };
      } finally {
        await release();
      }
    },
  };
}
