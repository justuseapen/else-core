package ai.openclaw.app

import java.time.Instant
import java.time.ZoneId

<<<<<<< HEAD
enum class NotificationPackageFilterMode(val rawValue: String) {
=======
/** Package-filter mode used before notification events are forwarded to the gateway. */
enum class NotificationPackageFilterMode(
  val rawValue: String,
) {
>>>>>>> upstream/main
  Allowlist("allowlist"),
  Blocklist("blocklist"),
  ;

  companion object {
<<<<<<< HEAD
    fun fromRawValue(raw: String?): NotificationPackageFilterMode {
      return entries.firstOrNull { it.rawValue == raw?.trim()?.lowercase() } ?: Blocklist
    }
  }
}

=======
    /** Parses persisted filter mode text, defaulting to blocklist for safer forwarding. */
    fun fromRawValue(raw: String?): NotificationPackageFilterMode = entries.firstOrNull { it.rawValue == raw?.trim()?.lowercase() } ?: Blocklist
  }
}

/** Runtime policy used before forwarding notification events to a node session. */
>>>>>>> upstream/main
internal data class NotificationForwardingPolicy(
  val enabled: Boolean,
  val mode: NotificationPackageFilterMode,
  val packages: Set<String>,
  val quietHoursEnabled: Boolean,
  val quietStart: String,
  val quietEnd: String,
  val maxEventsPerMinute: Int,
  val sessionKey: String?,
)

<<<<<<< HEAD
=======
/** Applies the operator-configured package allow/block list after trimming input. */
>>>>>>> upstream/main
internal fun NotificationForwardingPolicy.allowsPackage(packageName: String): Boolean {
  val normalized = packageName.trim()
  if (normalized.isEmpty()) {
    return false
  }
  return when (mode) {
    NotificationPackageFilterMode.Allowlist -> packages.contains(normalized)
    NotificationPackageFilterMode.Blocklist -> !packages.contains(normalized)
  }
}

<<<<<<< HEAD
=======
/** Returns true for both same-day and overnight quiet-hour windows. */
>>>>>>> upstream/main
internal fun NotificationForwardingPolicy.isWithinQuietHours(
  nowEpochMs: Long,
  zoneId: ZoneId = ZoneId.systemDefault(),
): Boolean {
  if (!quietHoursEnabled) {
    return false
  }
  val startMinutes = parseLocalHourMinute(quietStart) ?: return false
  val endMinutes = parseLocalHourMinute(quietEnd) ?: return false
  if (startMinutes == endMinutes) {
    return true
  }
  val now =
<<<<<<< HEAD
    Instant.ofEpochMilli(nowEpochMs)
=======
    Instant
      .ofEpochMilli(nowEpochMs)
>>>>>>> upstream/main
      .atZone(zoneId)
      .toLocalTime()
  val nowMinutes = now.hour * 60 + now.minute
  return if (startMinutes < endMinutes) {
    nowMinutes in startMinutes until endMinutes
  } else {
    nowMinutes >= startMinutes || nowMinutes < endMinutes
  }
}

private val localHourMinuteRegex = Regex("""^([01]\d|2[0-3]):([0-5]\d)$""")

<<<<<<< HEAD
=======
/** Normalizes persisted or user-entered local times to strict HH:mm form. */
>>>>>>> upstream/main
internal fun normalizeLocalHourMinute(raw: String): String? {
  val trimmed = raw.trim()
  val match = localHourMinuteRegex.matchEntire(trimmed) ?: return null
  return "${match.groupValues[1]}:${match.groupValues[2]}"
}

<<<<<<< HEAD
=======
/** Converts strict local HH:mm text to minutes since midnight for window checks. */
>>>>>>> upstream/main
internal fun parseLocalHourMinute(raw: String): Int? {
  val normalized = normalizeLocalHourMinute(raw) ?: return null
  val parts = normalized.split(':')
  val hour = parts[0].toInt()
  val minute = parts[1].toInt()
  return hour * 60 + minute
}

<<<<<<< HEAD
=======
/** Fixed-window limiter that bounds notification bursts per wall-clock minute. */
>>>>>>> upstream/main
internal class NotificationBurstLimiter {
  private val lock = Any()
  private var windowStartMs: Long = -1L
  private var eventsInWindow: Int = 0

<<<<<<< HEAD
  fun allow(nowEpochMs: Long, maxEventsPerMinute: Int): Boolean {
    if (maxEventsPerMinute <= 0) {
      return false
    }
=======
  /** Returns true when the current minute bucket still has forwarding capacity. */
  fun allow(
    nowEpochMs: Long,
    maxEventsPerMinute: Int,
  ): Boolean {
    if (maxEventsPerMinute <= 0) {
      return false
    }
    // Align all callers to the same minute bucket so concurrent notifications
    // share the quota even when they arrive with slightly different timestamps.
>>>>>>> upstream/main
    val currentWindow = nowEpochMs - (nowEpochMs % 60_000L)
    synchronized(lock) {
      if (currentWindow != windowStartMs) {
        windowStartMs = currentWindow
        eventsInWindow = 0
      }
      if (eventsInWindow >= maxEventsPerMinute) {
        return false
      }
      eventsInWindow += 1
      return true
    }
  }
}
