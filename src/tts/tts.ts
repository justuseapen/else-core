<<<<<<< HEAD
export {
  _test,
=======
/**
 * Public TTS runtime barrel exposed to core callers and plugin SDK facades.
 * Implementation stays in plugin-sdk/tts-runtime so provider surfaces share one contract.
 */
export {
  testApi as _test,
  testApi,
>>>>>>> upstream/main
  buildTtsSystemPromptHint,
  getLastTtsAttempt,
  getResolvedSpeechProviderConfig,
  getTtsMaxLength,
<<<<<<< HEAD
=======
  getTtsPersona,
>>>>>>> upstream/main
  getTtsProvider,
  isSummarizationEnabled,
  isTtsEnabled,
  isTtsProviderConfigured,
  listSpeechVoices,
<<<<<<< HEAD
  maybeApplyTtsToPayload,
=======
  listTtsPersonas,
  maybeApplyTtsToPayload,
  resolveExplicitTtsOverrides,
>>>>>>> upstream/main
  resolveTtsAutoMode,
  resolveTtsConfig,
  resolveTtsPrefsPath,
  resolveTtsProviderOrder,
  setLastTtsAttempt,
  setSummarizationEnabled,
  setTtsAutoMode,
  setTtsEnabled,
  setTtsMaxLength,
<<<<<<< HEAD
  setTtsProvider,
  synthesizeSpeech,
  textToSpeech,
=======
  setTtsPersona,
  setTtsProvider,
  synthesizeSpeech,
  streamSpeech,
  textToSpeech,
  textToSpeechStream,
>>>>>>> upstream/main
  textToSpeechTelephony,
  type ResolvedTtsConfig,
  type ResolvedTtsModelOverrides,
  type TtsDirectiveOverrides,
  type TtsDirectiveParseResult,
  type TtsResult,
  type TtsSynthesisResult,
<<<<<<< HEAD
=======
  type TtsSynthesisStreamResult,
  type TtsStreamResult,
>>>>>>> upstream/main
  type TtsTelephonyResult,
} from "../plugin-sdk/tts-runtime.js";
