import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import {
  CameraSourceClient,
  cameraSourceConfigFromEnv,
} from "../hmi/camera-source.mjs";

test("camera source configuration stays on loopback", () => {
  const config = cameraSourceConfigFromEnv({ HMI_CAMERA_ENABLED: "true" });
  assert.equal(config.enabled, true);
  assert.equal(config.streamUrl, "http://127.0.0.1:8788/stream");
  assert.equal(config.stateUrl, "http://127.0.0.1:8788/state");
  assert.throws(
    () => cameraSourceConfigFromEnv({ HMI_CAMERA_SOURCE_URL: "http://192.168.58.20:8788/stream" }),
    /loopback/,
  );
});

test("camera source health normalizes ustreamer state", async () => {
  const client = new CameraSourceClient({
    enabled: true,
    streamUrl: "http://127.0.0.1:8788/stream",
    stateUrl: "http://127.0.0.1:8788/state",
    timeoutMs: 100,
  }, {
    fetch: async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        result: {
          source: {
            online: true,
            resolution: { width: 1920, height: 1080 },
            desired_fps: 25,
            captured_fps: 24,
          },
          stream: { clients: 2 },
        },
      }),
    }),
  });

  const status = await client.refresh();
  assert.equal(status.online, true);
  assert.equal(status.resolution, "1920x1080");
  assert.equal(status.capturedFps, 24);
  assert.equal(status.clients, 2);
  assert.equal(status.error, null);
});

test("live proxy forwards the fixed MJPEG stream without buffering", async (t) => {
  const upstream = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "multipart/x-mixed-replace; boundary=frame" });
    res.end("--frame\r\nContent-Type: image/jpeg\r\n\r\njpeg\r\n--frame--\r\n");
  });
  await new Promise((resolve) => upstream.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => upstream.close(resolve)));
  const upstreamPort = upstream.address().port;

  const client = new CameraSourceClient({
    enabled: true,
    streamUrl: `http://127.0.0.1:${upstreamPort}/stream`,
    stateUrl: `http://127.0.0.1:${upstreamPort}/state`,
    timeoutMs: 1000,
  });
  const proxy = createServer((req, res) => client.proxyLive(req, res));
  await new Promise((resolve) => proxy.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => proxy.close(resolve)));
  const proxyPort = proxy.address().port;

  const response = await fetch(`http://127.0.0.1:${proxyPort}/api/video/live`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /multipart\/x-mixed-replace/);
  assert.match(await response.text(), /jpeg/);
});
