import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_STATION_DURATIONS_MS,
  StationTimingModel,
} from "../hmi/station-timing.mjs";

const stationCodes = Object.keys(DEFAULT_STATION_DURATIONS_MS);

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    value: (key) => values.get(key),
  };
}

test("learns successful station durations and uses their median", () => {
  const storage = memoryStorage();
  const model = new StationTimingModel({ storage });

  model.observe("S30_WAIT_START", stationCodes, 0);
  model.observe(stationCodes[0], stationCodes, 100);
  model.observe(stationCodes[1], stationCodes, 1100);
  model.observe(stationCodes[2], stationCodes, 4100);

  assert.deepEqual(model.stats(stationCodes[0]), { durationMs: 1000, sampleCount: 1 });
  assert.deepEqual(model.stats(stationCodes[1]), { durationMs: 3000, sampleCount: 1 });
  assert.match(storage.value("fairino-hmi-station-timings-v1"), /1000/);
});

test("does not learn partial, skipped, faulted, or implausible observations", () => {
  const model = new StationTimingModel();

  model.observe(stationCodes[2], stationCodes, 1000);
  model.observe(stationCodes[3], stationCodes, 2000);
  model.observe("S900_FAULT", stationCodes, 3000);
  model.observe(stationCodes[0], stationCodes, 4000);
  model.observe(stationCodes[2], stationCodes, 5000);

  assert.equal(model.stats(stationCodes[2]).sampleCount, 0);
  assert.equal(model.stats(stationCodes[3]).sampleCount, 0);
  assert.equal(model.stats(stationCodes[0]).sampleCount, 0);
});

test("progress advances linearly from measured timing and waits below complete", () => {
  const storage = memoryStorage({
    "fairino-hmi-station-timings-v1": JSON.stringify({ [stationCodes[0]]: [1000] }),
  });
  const model = new StationTimingModel({ storage });

  model.observe("S30_WAIT_START", stationCodes, 0);
  model.observe(stationCodes[0], stationCodes, 100);

  assert.equal(model.progress(stationCodes[0], 600), 0.5);
  assert.equal(model.progress(stationCodes[0], 2100), 0.985);
});

test("retains only recent valid timing samples", () => {
  const storage = memoryStorage({
    "fairino-hmi-station-timings-v1": JSON.stringify({
      [stationCodes[0]]: [100, 300, 400, 500, 600, 700, 800, 900, 130000, "bad"],
    }),
  });
  const model = new StationTimingModel({ storage, sampleLimit: 7 });

  assert.deepEqual(model.stats(stationCodes[0]), { durationMs: 600, sampleCount: 7 });
});
