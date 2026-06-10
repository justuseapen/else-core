<<<<<<< HEAD
=======
/**
 * Baseline floors for live prompt-cache regression tests.
 *
 * These numbers capture observed provider cache usage and the minimums that
 * live validation should enforce or warn about for each cache lane.
 */
/** Per-lane cache evidence thresholds used by live cache regression checks. */
>>>>>>> upstream/main
export type LiveCacheFloor = {
  observedCacheRead?: number;
  observedCacheWrite?: number;
  observedHitRate?: number;
  minCacheRead?: number;
<<<<<<< HEAD
=======
  minCacheReadOrWrite?: number;
>>>>>>> upstream/main
  minCacheWrite?: number;
  minHitRate?: number;
  maxCacheRead?: number;
  maxCacheWrite?: number;
<<<<<<< HEAD
};

=======
  warnOnly?: boolean;
};

/** Provider and lane-specific cache regression baseline. */
>>>>>>> upstream/main
export const LIVE_CACHE_REGRESSION_BASELINE = {
  anthropic: {
    disabled: {
      observedCacheRead: 0,
      observedCacheWrite: 0,
      maxCacheRead: 32,
      maxCacheWrite: 32,
    },
    image: {
      observedCacheRead: 5_660,
      observedCacheWrite: 85,
      observedHitRate: 0.985,
      minCacheRead: 4_500,
      minCacheWrite: 1,
      minHitRate: 0.97,
    },
    mcp: {
      observedCacheRead: 6_240,
      observedCacheWrite: 113,
      observedHitRate: 0.982,
      minCacheRead: 5_800,
      minCacheWrite: 1,
      minHitRate: 0.97,
    },
    stable: {
      observedCacheRead: 5_660,
      observedCacheWrite: 18,
      observedHitRate: 0.996,
<<<<<<< HEAD
      minCacheRead: 5_400,
      minCacheWrite: 1,
      minHitRate: 0.97,
=======
      minCacheReadOrWrite: 5_400,
      minCacheWrite: 1,
>>>>>>> upstream/main
    },
    tool: {
      observedCacheRead: 6_223,
      observedCacheWrite: 97,
      observedHitRate: 0.984,
      minCacheRead: 5_000,
      minCacheWrite: 1,
      minHitRate: 0.97,
    },
  },
  openai: {
    image: {
      observedCacheRead: 4_864,
      observedHitRate: 0.954,
      minCacheRead: 3_840,
      minHitRate: 0.82,
<<<<<<< HEAD
=======
      warnOnly: true,
>>>>>>> upstream/main
    },
    mcp: {
      observedCacheRead: 4_608,
      observedHitRate: 0.891,
      minCacheRead: 4_096,
      minHitRate: 0.85,
<<<<<<< HEAD
=======
      warnOnly: true,
>>>>>>> upstream/main
    },
    stable: {
      observedCacheRead: 4_864,
      observedHitRate: 0.966,
      minCacheRead: 4_608,
      minHitRate: 0.9,
<<<<<<< HEAD
=======
      warnOnly: true,
>>>>>>> upstream/main
    },
    tool: {
      observedCacheRead: 4_608,
      observedHitRate: 0.896,
      minCacheRead: 4_096,
      minHitRate: 0.85,
<<<<<<< HEAD
=======
      warnOnly: true,
>>>>>>> upstream/main
    },
  },
} as const satisfies Record<string, Record<string, LiveCacheFloor>>;
