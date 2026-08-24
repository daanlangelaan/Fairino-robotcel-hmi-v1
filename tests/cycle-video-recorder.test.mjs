import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  CycleFaultVideoRecorder,
  serveThumbnail,
  serveVideoFile,
  videoRecorderConfigFromEnv,
} from "../hmi/cycle-video-recorder.mjs";

class FakeCapture extends EventEmitter {
  constructor() {
    super();
    this.stderr = new PassThrough();
    this.signals = [];
  }

  kill(signal) {
    this.signals.push(signal);
    queueMicrotask(() => this.emit("close", 0, signal));
    return true;
  }
}

function testConfig(storageDir, overrides = {}) {
  return {
    enabled: true,
    ffmpegPath: "/usr/bin/ffmpeg",
    ffprobePath: "/usr/bin/ffprobe",
    sourceUrl: "http://127.0.0.1:8788/stream",
    device: "/dev/v4l/by-id/test-camera-video-index0",
    storageDir,
    inputFormat: "mjpeg",
    width: 1280,
    height: 720,
    fps: 25,
    bufferSeconds: 10,
    postFaultSeconds: 0,
    segmentSeconds: 1,
    retentionDays: 30,
    maxIncidents: 50,
    ...overrides,
  };
}

async function createTestRecorder(t, options = {}) {
  const storageDir = options.storageDir || await mkdtemp(join(tmpdir(), "fairino-video-test-"));
  if (!options.storageDir) t.after(() => rm(storageDir, { recursive: true, force: true }));
  const captures = [];
  const events = [];
  const recorder = new CycleFaultVideoRecorder(testConfig(storageDir, options.config), {
    spawnCapture: () => {
      const capture = new FakeCapture();
      captures.push(capture);
      return capture;
    },
    assembleClip: async (_config, segments, temporaryClip) => {
      const content = await Promise.all(segments.map((path) => readFile(path)));
      await writeFile(temporaryClip, Buffer.concat(content));
    },
    probeDuration: async () => 9.5,
    createThumbnail: async (_config, _clip, thumbnail) => writeFile(thumbnail, "thumbnail"),
    onEvent: (event) => events.push(event),
    ...options.dependencies,
  });
  await recorder.initialize();
  return { recorder, captures, events, storageDir };
}

async function recordFault(recorder, code, content = `fault-${code}`) {
  await recorder.observe({ productionActive: false, faultActive: false });
  await recorder.observe({ productionActive: true, faultActive: false });
  await writeFile(join(recorder.workDir, "segment-000000.mkv"), content);
  await recorder.observe({
    productionActive: false,
    faultActive: true,
    faultCode: code,
    faultMessage: `Testfout ${code}`,
  });
}

test("camera configuration uses the live source and bounded library defaults", () => {
  const defaults = videoRecorderConfigFromEnv({});
  assert.equal(defaults.enabled, false);
  assert.equal(defaults.sourceUrl, "http://127.0.0.1:8788/stream");
  assert.equal(defaults.width, 1920);
  assert.equal(defaults.height, 1080);
  assert.equal(defaults.bufferSeconds, 120);
  assert.equal(defaults.postFaultSeconds, 10);
  assert.equal(defaults.retentionDays, 30);
  assert.equal(defaults.maxIncidents, 50);
  const config = videoRecorderConfigFromEnv({
    HMI_CAMERA_ENABLED: "true",
    HMI_CAMERA_BUFFER_SECONDS: "9999",
    HMI_CAMERA_POSTFAULT_SECONDS: "999",
    HMI_CAMERA_MAX_INCIDENTS: "0",
    HMI_CAMERA_FPS: "0",
  });
  assert.equal(config.enabled, true);
  assert.equal(config.bufferSeconds, 600);
  assert.equal(config.postFaultSeconds, 120);
  assert.equal(config.maxIncidents, 1);
  assert.equal(config.fps, 1);
});

test("production faults create a newest-first incident library with thumbnails", async (t) => {
  let nowMs = Date.parse("2026-08-11T12:00:00.000Z");
  const { recorder, captures } = await createTestRecorder(t, {
    dependencies: { now: () => new Date(nowMs) },
  });

  await recordFault(recorder, 6, "first-fault");
  assert.deepEqual(captures[0].signals, ["SIGINT"]);
  assert.equal(recorder.status().state, "fault-ready");
  assert.equal(recorder.status().incidentCount, 1);
  assert.equal(recorder.status().latestIncident.faultCode, 6);
  const first = recorder.getIncident(recorder.listIncidents()[0].id);
  assert.equal(await readFile(first.clipPath, "utf8"), "first-fault");
  assert.equal(await readFile(first.thumbnailPath, "utf8"), "thumbnail");

  nowMs += 1000;
  await recordFault(recorder, 3, "newer-fault");
  assert.deepEqual(recorder.listIncidents().map((item) => item.faultCode), [3, 6]);
  const newest = recorder.getIncident(recorder.listIncidents()[0].id);
  assert.equal(await readFile(newest.clipPath, "utf8"), "newer-fault");
  await recorder.shutdown();
});

test("post-fault capture remains active for the configured delay", async (t) => {
  let releasePostFault;
  const postFaultWait = new Promise((resolve) => {
    releasePostFault = resolve;
  });
  const { recorder, captures } = await createTestRecorder(t, {
    config: { postFaultSeconds: 10 },
    dependencies: { sleep: () => postFaultWait },
  });

  await recorder.observe({ productionActive: true, faultActive: false });
  await writeFile(join(recorder.workDir, "segment-000000.mkv"), "with-post-fault");
  const preserving = recorder.observe({ productionActive: false, faultActive: true, faultCode: 9 });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(recorder.status().state, "post-fault");
  assert.equal(recorder.status().recording, true);
  assert.equal(recorder.status().activeFault.faultCode, 9);
  assert.equal(recorder.status().activeFault.incidentId, null);
  assert.deepEqual(captures[0].signals, []);
  releasePostFault();
  await preserving;
  assert.deepEqual(captures[0].signals, ["SIGINT"]);
  assert.equal(recorder.status().incidentCount, 1);
  assert.equal(recorder.status().activeFault.incidentId, recorder.status().latestIncident.id);
  await recorder.observe({ productionActive: false, faultActive: false });
  assert.equal(recorder.status().activeFault, null);
  await recorder.shutdown();
});

test("retention keeps only the configured newest incidents and reloads metadata", async (t) => {
  const storageDir = await mkdtemp(join(tmpdir(), "fairino-video-retention-test-"));
  t.after(() => rm(storageDir, { recursive: true, force: true }));
  let nowMs = Date.parse("2026-08-11T12:00:00.000Z");
  const first = await createTestRecorder(t, {
    storageDir,
    config: { maxIncidents: 2 },
    dependencies: { now: () => new Date(nowMs) },
  });
  await recordFault(first.recorder, 1);
  nowMs += 1000;
  await recordFault(first.recorder, 2);
  nowMs += 1000;
  await recordFault(first.recorder, 3);
  assert.deepEqual(first.recorder.listIncidents().map((item) => item.faultCode), [3, 2]);
  await first.recorder.shutdown();

  const reloaded = new CycleFaultVideoRecorder(testConfig(storageDir, { maxIncidents: 2 }), {
    now: () => new Date(nowMs),
  });
  await reloaded.initialize();
  assert.deepEqual(reloaded.listIncidents().map((item) => item.faultCode), [3, 2]);
  await reloaded.shutdown();
});

test("a normal cycle stop discards the ring but retains the library", async (t) => {
  const { recorder } = await createTestRecorder(t);
  await recordFault(recorder, 1);
  await recorder.observe({ productionActive: false, faultActive: false });
  await recorder.observe({ productionActive: true, faultActive: false });
  await writeFile(join(recorder.workDir, "segment-000000.mkv"), "throw-away");
  await recorder.observe({ productionActive: false, faultActive: false });

  assert.equal(recorder.status().state, "fault-ready");
  assert.equal(recorder.status().incidentCount, 1);
  assert.deepEqual(await recorder.listSegments(), []);
  await recorder.shutdown();
});

test("a camera start failure is diagnostic and does not escape observe", async (t) => {
  const storageDir = await mkdtemp(join(tmpdir(), "fairino-video-failure-test-"));
  t.after(() => rm(storageDir, { recursive: true, force: true }));
  const recorder = new CycleFaultVideoRecorder(testConfig(storageDir), {
    spawnCapture: () => {
      throw new Error("camera ontbreekt");
    },
  });
  await recorder.initialize();

  await recorder.observe({ productionActive: true, faultActive: false });

  assert.equal(recorder.status().state, "error");
  assert.match(recorder.status().error, /camera ontbreekt/);
  assert.equal(recorder.status().recording, false);
  await recorder.shutdown();
});

test("fixed media endpoints support video ranges and thumbnails", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "fairino-video-http-test-"));
  const clipPath = join(directory, "incident.mp4");
  const thumbnailPath = join(directory, "incident.jpg");
  await writeFile(clipPath, "0123456789");
  await writeFile(thumbnailPath, "jpeg-data");
  t.after(() => rm(directory, { recursive: true, force: true }));

  const server = createServer((req, res) => {
    const operation = req.url === "/thumbnail"
      ? serveThumbnail(req, res, thumbnailPath)
      : serveVideoFile(req, res, clipPath);
    operation.catch((error) => {
      res.writeHead(500);
      res.end(error.message);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();

  const full = await fetch(`http://127.0.0.1:${port}/video`);
  assert.equal(full.status, 200);
  assert.equal(await full.text(), "0123456789");

  const partial = await fetch(`http://127.0.0.1:${port}/video`, { headers: { Range: "bytes=2-5" } });
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get("content-range"), "bytes 2-5/10");
  assert.equal(await partial.text(), "2345");

  const invalid = await fetch(`http://127.0.0.1:${port}/video`, { headers: { Range: "bytes=20-30" } });
  assert.equal(invalid.status, 416);

  const thumbnail = await fetch(`http://127.0.0.1:${port}/thumbnail`);
  assert.equal(thumbnail.headers.get("content-type"), "image/jpeg");
  assert.equal(await thumbnail.text(), "jpeg-data");
});
