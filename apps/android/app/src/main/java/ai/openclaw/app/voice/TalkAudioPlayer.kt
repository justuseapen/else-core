package ai.openclaw.app.voice

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.media.MediaPlayer
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.io.File

<<<<<<< HEAD
internal class TalkAudioPlayer(
  private val context: Context,
) {
  private val lock = Any()
  private var active: ActivePlayback? = null

  suspend fun play(audio: TalkSpeakAudio) {
=======
internal interface TalkAudioPlaying {
  /** Plays one assistant reply, replacing any active playback. */
  suspend fun play(audio: TalkSpeakAudio)

  /** Cancels any active assistant reply playback. */
  fun stop()
}

/** Android playback adapter for remote talk.speak audio payloads. */
internal class TalkAudioPlayer(
  private val context: Context,
) : TalkAudioPlaying {
  private val lock = Any()
  private var active: ActivePlayback? = null

  override suspend fun play(audio: TalkSpeakAudio) {
>>>>>>> upstream/main
    when (val mode = resolvePlaybackMode(audio)) {
      is TalkPlaybackMode.Pcm -> playPcm(audio.bytes, mode.sampleRate)
      is TalkPlaybackMode.Compressed -> playCompressed(audio.bytes, mode.fileExtension)
    }
  }

<<<<<<< HEAD
  fun stop() {
=======
  override fun stop() {
>>>>>>> upstream/main
    synchronized(lock) {
      active?.cancel()
      active = null
    }
  }

<<<<<<< HEAD
  internal fun resolvePlaybackMode(audio: TalkSpeakAudio): TalkPlaybackMode {
    return resolvePlaybackMode(
=======
  /** Resolves playback mode from the metadata carried with a talk.speak response. */
  internal fun resolvePlaybackMode(audio: TalkSpeakAudio): TalkPlaybackMode =
    resolvePlaybackMode(
>>>>>>> upstream/main
      outputFormat = audio.outputFormat,
      mimeType = audio.mimeType,
      fileExtension = audio.fileExtension,
    )
<<<<<<< HEAD
  }

  companion object {
=======

  companion object {
    /** Chooses PCM streaming or MediaPlayer-backed playback from provider metadata. */
>>>>>>> upstream/main
    internal fun resolvePlaybackMode(
      outputFormat: String?,
      mimeType: String?,
      fileExtension: String?,
    ): TalkPlaybackMode {
      val normalizedOutputFormat = outputFormat?.trim()?.lowercase()
      if (normalizedOutputFormat != null) {
        val pcmSampleRate = parsePcmSampleRate(normalizedOutputFormat)
        if (pcmSampleRate != null) {
          return TalkPlaybackMode.Pcm(sampleRate = pcmSampleRate)
        }
      }
      val normalizedMimeType = mimeType?.trim()?.lowercase()
      val extension =
        normalizeExtension(
          fileExtension ?: inferExtension(outputFormat = normalizedOutputFormat, mimeType = normalizedMimeType),
        )
      if (extension != null) {
        return TalkPlaybackMode.Compressed(fileExtension = extension)
      }
      throw IllegalStateException("Unsupported talk audio format")
    }

<<<<<<< HEAD
    private fun parsePcmSampleRate(outputFormat: String): Int? {
      return when (outputFormat) {
=======
    private fun parsePcmSampleRate(outputFormat: String): Int? =
      when (outputFormat) {
>>>>>>> upstream/main
        "pcm_16000" -> 16_000
        "pcm_22050" -> 22_050
        "pcm_24000" -> 24_000
        "pcm_44100" -> 44_100
        else -> null
      }
<<<<<<< HEAD
    }

    private fun inferExtension(outputFormat: String?, mimeType: String?): String? {
      return when {
=======

    private fun inferExtension(
      outputFormat: String?,
      mimeType: String?,
    ): String? =
      when {
>>>>>>> upstream/main
        outputFormat == "mp3" || outputFormat?.startsWith("mp3_") == true || mimeType == "audio/mpeg" -> ".mp3"
        outputFormat == "opus" || outputFormat?.startsWith("opus_") == true || mimeType == "audio/ogg" -> ".ogg"
        outputFormat?.endsWith("-wav") == true || mimeType == "audio/wav" -> ".wav"
        outputFormat?.endsWith("-webm") == true || mimeType == "audio/webm" -> ".webm"
        else -> null
      }
<<<<<<< HEAD
    }
=======
>>>>>>> upstream/main

    private fun normalizeExtension(value: String?): String? {
      val trimmed = value?.trim()?.lowercase().orEmpty()
      if (trimmed.isEmpty()) return null
      return if (trimmed.startsWith(".")) trimmed else ".$trimmed"
    }
  }

<<<<<<< HEAD
  private suspend fun playPcm(bytes: ByteArray, sampleRate: Int) {
=======
  private suspend fun playPcm(
    bytes: ByteArray,
    sampleRate: Int,
  ) {
>>>>>>> upstream/main
    withContext(Dispatchers.IO) {
      val minBufferSize =
        AudioTrack.getMinBufferSize(
          sampleRate,
          AudioFormat.CHANNEL_OUT_MONO,
          AudioFormat.ENCODING_PCM_16BIT,
        )
      if (minBufferSize <= 0) {
        throw IllegalStateException("AudioTrack buffer unavailable")
      }
      val track =
<<<<<<< HEAD
        AudioTrack.Builder()
          .setAudioAttributes(
            AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_MEDIA)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build(),
          )
          .setAudioFormat(
            AudioFormat.Builder()
=======
        AudioTrack
          .Builder()
          .setAudioAttributes(
            AudioAttributes
              .Builder()
              .setUsage(AudioAttributes.USAGE_MEDIA)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build(),
          ).setAudioFormat(
            AudioFormat
              .Builder()
>>>>>>> upstream/main
              .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
              .setSampleRate(sampleRate)
              .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
              .build(),
<<<<<<< HEAD
          )
          .setTransferMode(AudioTrack.MODE_STATIC)
=======
          ).setTransferMode(AudioTrack.MODE_STATIC)
>>>>>>> upstream/main
          .setBufferSizeInBytes(maxOf(minBufferSize, bytes.size))
          .build()
      val finished = CompletableDeferred<Unit>()
      val playback =
        ActivePlayback(
          cancel = {
            finished.completeExceptionally(CancellationException("assistant speech cancelled"))
            runCatching { track.pause() }
            runCatching { track.flush() }
            runCatching { track.stop() }
          },
        )
      register(playback)
      try {
        val written = track.write(bytes, 0, bytes.size)
        if (written != bytes.size) {
          throw IllegalStateException("AudioTrack write failed")
        }
        val totalFrames = bytes.size / 2
        track.play()
        while (track.playState == AudioTrack.PLAYSTATE_PLAYING) {
          if (track.playbackHeadPosition >= totalFrames) {
            finished.complete(Unit)
            break
          }
          delay(20)
        }
        if (!finished.isCompleted) {
          finished.complete(Unit)
        }
        finished.await()
      } finally {
        clear(playback)
        runCatching { track.pause() }
        runCatching { track.flush() }
        runCatching { track.stop() }
        track.release()
      }
    }
  }

<<<<<<< HEAD
  private suspend fun playCompressed(bytes: ByteArray, fileExtension: String) {
    val tempFile = withContext(Dispatchers.IO) {
      File.createTempFile("talk-audio-", fileExtension, context.cacheDir).apply {
        writeBytes(bytes)
      }
    }
=======
  private suspend fun playCompressed(
    bytes: ByteArray,
    fileExtension: String,
  ) {
    // MediaPlayer needs a seekable data source for several compressed formats,
    // so cache the response bytes briefly instead of streaming from memory.
    val tempFile =
      withContext(Dispatchers.IO) {
        File.createTempFile("talk-audio-", fileExtension, context.cacheDir).apply {
          writeBytes(bytes)
        }
      }
>>>>>>> upstream/main
    try {
      val finished = CompletableDeferred<Unit>()
      val player =
        withContext(Dispatchers.Main) {
          MediaPlayer().apply {
            setAudioAttributes(
<<<<<<< HEAD
              AudioAttributes.Builder()
=======
              AudioAttributes
                .Builder()
>>>>>>> upstream/main
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build(),
            )
            setDataSource(tempFile.absolutePath)
            setOnCompletionListener {
              finished.complete(Unit)
            }
            setOnErrorListener { _, what, extra ->
              finished.completeExceptionally(IllegalStateException("MediaPlayer error ($what/$extra)"))
              true
            }
            prepare()
          }
        }
      val playback =
        ActivePlayback(
          cancel = {
            finished.completeExceptionally(CancellationException("assistant speech cancelled"))
            runCatching { player.stop() }
          },
        )
      register(playback)
      try {
        withContext(Dispatchers.Main) {
          player.start()
        }
        finished.await()
      } finally {
        clear(playback)
        withContext(Dispatchers.Main) {
          runCatching { player.stop() }
          player.release()
        }
      }
    } finally {
      withContext(Dispatchers.IO) {
        tempFile.delete()
      }
    }
  }

  private fun register(playback: ActivePlayback) {
    synchronized(lock) {
      active?.cancel()
      active = playback
    }
  }

  private fun clear(playback: ActivePlayback) {
    synchronized(lock) {
      if (active === playback) {
        active = null
      }
    }
  }
<<<<<<< HEAD

}

internal sealed interface TalkPlaybackMode {
  data class Pcm(val sampleRate: Int) : TalkPlaybackMode

  data class Compressed(val fileExtension: String) : TalkPlaybackMode
=======
}

internal sealed interface TalkPlaybackMode {
  /** Raw signed 16-bit mono PCM returned by providers that support low-latency output. */
  data class Pcm(
    val sampleRate: Int,
  ) : TalkPlaybackMode

  /** Compressed audio that Android decodes through MediaPlayer. */
  data class Compressed(
    val fileExtension: String,
  ) : TalkPlaybackMode
>>>>>>> upstream/main
}

private class ActivePlayback(
  val cancel: () -> Unit,
)
