export const DEFAULT_STATION_DURATIONS_MS = Object.freeze({
  S40_SELECT_FILTER_DISPENSER: 700,
  S50_DISPENSE_FILTER: 700,
  S60_PICK_FILTER: 4500,
  S70_PLACE_FILTER_IN_CLAMP: 4000,
  S80_CLAMP_FILTER: 800,
  S90_DISPENSE_CHECK_VALVE: 1400,
  S100_PICK_CHECK_VALVE: 8500,
  S110_APPLY_GLUE: 5000,
  S120_INSERT_CHECK_VALVE: 3500,
  S130_PRESS_CHECK_VALVE: 1200,
  S140_UNCLAMP_FILTER: 800,
  S150_PICK_FINISHED_FILTER: 4500,
  S160_PLACE_IN_DRYING_ROW: 5500,
  S170_INDEX_DRYING_ROW: 6500,
  S180_CYCLE_COMPLETE: 700,
});

const DEFAULT_STORAGE_KEY = "fairino-hmi-station-timings-v1";
const MIN_DURATION_MS = 250;
const MAX_DURATION_MS = 120000;

export class StationTimingModel {
  constructor({
    storage = null,
    storageKey = DEFAULT_STORAGE_KEY,
    defaults = DEFAULT_STATION_DURATIONS_MS,
    sampleLimit = 7,
  } = {}) {
    this.storage = storage;
    this.storageKey = storageKey;
    this.defaults = defaults;
    this.sampleLimit = sampleLimit;
    this.samples = this.#load();
    this.observation = {
      code: null,
      startedAt: 0,
      completeSampleEligible: false,
    };
  }

  observe(stateCode, orderedStationCodes, now = Date.now()) {
    if (this.observation.code === stateCode) return;

    const previousCode = this.observation.code;
    const previousIndex = orderedStationCodes.indexOf(previousCode);
    const currentIndex = orderedStationCodes.indexOf(stateCode);
    const enteredNextStation = previousIndex >= 0 && currentIndex === previousIndex + 1;
    const completedLastStation = previousIndex === orderedStationCodes.length - 1
      && (stateCode === "S190_CHECK_NEXT_CYCLE" || stateCode === "S850_BATCH_COMPLETE");

    if ((enteredNextStation || completedLastStation)
      && this.observation.completeSampleEligible) {
      this.#record(previousCode, now - this.observation.startedAt);
    }

    const enteredFirstStation = currentIndex === 0
      && (previousCode === "S30_WAIT_START" || previousCode === "S190_CHECK_NEXT_CYCLE");
    this.observation = {
      code: stateCode,
      startedAt: now,
      completeSampleEligible: currentIndex >= 0 && (enteredNextStation || enteredFirstStation),
    };
  }

  stats(code) {
    const samples = this.samples[code] || [];
    return {
      durationMs: samples.length > 0 ? median(samples) : (this.defaults[code] || 3000),
      sampleCount: samples.length,
    };
  }

  progress(code, now = Date.now()) {
    if (this.observation.code !== code) return 0.02;
    const elapsedMs = Math.max(0, now - this.observation.startedAt);
    return Math.max(0.02, Math.min(0.985, elapsedMs / this.stats(code).durationMs));
  }

  #record(code, durationMs) {
    if (!this.defaults[code]
      || !Number.isFinite(durationMs)
      || durationMs < MIN_DURATION_MS
      || durationMs > MAX_DURATION_MS) return;
    this.samples = {
      ...this.samples,
      [code]: [...(this.samples[code] || []), Math.round(durationMs)].slice(-this.sampleLimit),
    };
    this.#save();
  }

  #load() {
    try {
      const parsed = JSON.parse(this.storage?.getItem(this.storageKey) || "{}");
      return Object.fromEntries(Object.entries(parsed)
        .filter(([code, samples]) => this.defaults[code] && Array.isArray(samples))
        .map(([code, samples]) => [
          code,
          samples
            .map(Number)
            .filter((duration) => Number.isFinite(duration)
              && duration >= MIN_DURATION_MS
              && duration <= MAX_DURATION_MS)
            .slice(-this.sampleLimit),
        ]));
    } catch {
      return {};
    }
  }

  #save() {
    try {
      this.storage?.setItem(this.storageKey, JSON.stringify(this.samples));
    } catch {
      // Persistence is optional; keep learning in memory if storage is unavailable.
    }
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
