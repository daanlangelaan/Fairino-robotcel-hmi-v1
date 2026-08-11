import { get as httpGet } from "node:http";

function parseEnabled(value) {
  return ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
}

function loopbackUrl(value, fallback) {
  const url = new URL(value || fallback);
  if (url.protocol !== "http:") throw new Error("Camerabron moet lokale HTTP gebruiken");
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) {
    throw new Error("Camerabron moet aan loopback gebonden blijven");
  }
  return url.toString();
}

export function cameraSourceConfigFromEnv(env = process.env) {
  const baseUrl = loopbackUrl(
    env.HMI_CAMERA_SOURCE_BASE_URL,
    "http://127.0.0.1:8788/",
  );
  return {
    enabled: parseEnabled(env.HMI_CAMERA_ENABLED),
    streamUrl: loopbackUrl(env.HMI_CAMERA_SOURCE_URL, new URL("stream", baseUrl)),
    stateUrl: loopbackUrl(env.HMI_CAMERA_SOURCE_STATE_URL, new URL("state", baseUrl)),
    timeoutMs: 1500,
  };
}

export class CameraSourceClient {
  constructor(config, dependencies = {}) {
    this.config = { ...config };
    this.fetch = dependencies.fetch || globalThis.fetch;
    this.httpGet = dependencies.httpGet || httpGet;
    this.current = {
      online: false,
      resolution: null,
      desiredFps: null,
      capturedFps: null,
      clients: 0,
      checkedAt: null,
      error: this.config.enabled ? "Camerabron nog niet gecontroleerd" : null,
    };
    this.refreshing = null;
  }

  async refresh() {
    if (!this.config.enabled) return this.status();
    if (this.refreshing) return this.refreshing;
    this.refreshing = this.refreshOnce().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  async refreshOnce() {
    try {
      const response = await this.fetch(this.config.stateUrl, {
        signal: AbortSignal.timeout(this.config.timeoutMs),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      const source = body?.result?.source || {};
      const stream = body?.result?.stream || {};
      this.current = {
        online: Boolean(body?.ok && source.online),
        resolution: source.resolution
          ? `${source.resolution.width}x${source.resolution.height}`
          : null,
        desiredFps: Number.isFinite(Number(source.desired_fps)) ? Number(source.desired_fps) : null,
        capturedFps: Number.isFinite(Number(source.captured_fps)) ? Number(source.captured_fps) : null,
        clients: Number.isFinite(Number(stream.clients)) ? Number(stream.clients) : 0,
        checkedAt: new Date().toISOString(),
        error: source.online ? null : "USB-camera is niet online",
      };
    } catch (error) {
      this.current = {
        ...this.current,
        online: false,
        checkedAt: new Date().toISOString(),
        error: `Lokale camerabron niet bereikbaar: ${error.message}`,
      };
    }
    return this.status();
  }

  status() {
    return {
      enabled: this.config.enabled,
      ...this.current,
    };
  }

  proxyLive(req, res) {
    if (!this.config.enabled) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      res.end(JSON.stringify({ error: "Camerabron is uitgeschakeld" }));
      return;
    }

    const upstream = this.httpGet(this.config.streamUrl, {
      headers: { Accept: "multipart/x-mixed-replace" },
    }, (upstreamResponse) => {
      if (upstreamResponse.statusCode !== 200) {
        upstreamResponse.resume();
        res.writeHead(502, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ error: `Camerabron antwoordde met HTTP ${upstreamResponse.statusCode}` }));
        return;
      }
      res.writeHead(200, {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": upstreamResponse.headers["content-type"] || "multipart/x-mixed-replace",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      upstreamResponse.pipe(res);
      res.once("close", () => upstreamResponse.destroy());
    });
    upstream.setTimeout(this.config.timeoutMs, () => {
      upstream.destroy(new Error("Timeout naar lokale camerabron"));
    });
    upstream.once("error", (error) => {
      if (res.headersSent) {
        res.destroy(error);
      } else {
        res.writeHead(502, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ error: `Livebeeld niet beschikbaar: ${error.message}` }));
      }
    });
  }
}
