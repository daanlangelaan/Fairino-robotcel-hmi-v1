import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import {
  chmod,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";

function parseEnabled(value) {
  return ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
}

function numberSetting(value, fallback, { min, max }) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

export function videoRecorderConfigFromEnv(env = process.env) {
  return {
    enabled: parseEnabled(env.HMI_CAMERA_ENABLED),
    ffmpegPath: env.HMI_CAMERA_FFMPEG || "/usr/bin/ffmpeg",
    ffprobePath: env.HMI_CAMERA_FFPROBE || "/usr/bin/ffprobe",
    sourceUrl: env.HMI_CAMERA_SOURCE_URL || "http://127.0.0.1:8788/stream",
    device: env.HMI_CAMERA_DEVICE
      || "/dev/v4l/by-id/usb-Jieli_Technology_USB_Composite_Device-video-index0",
    storageDir: env.HMI_CAMERA_STORAGE_DIR || "/var/lib/fairino-hmi/camera",
    inputFormat: env.HMI_CAMERA_INPUT_FORMAT || "mjpeg",
    width: numberSetting(env.HMI_CAMERA_WIDTH, 1920, { min: 320, max: 3840 }),
    height: numberSetting(env.HMI_CAMERA_HEIGHT, 1080, { min: 240, max: 2160 }),
    fps: numberSetting(env.HMI_CAMERA_FPS, 25, { min: 1, max: 60 }),
    bufferSeconds: numberSetting(env.HMI_CAMERA_BUFFER_SECONDS, 60, { min: 10, max: 600 }),
    postFaultSeconds: numberSetting(env.HMI_CAMERA_POSTFAULT_SECONDS, 10, { min: 0, max: 120 }),
    segmentSeconds: numberSetting(env.HMI_CAMERA_SEGMENT_SECONDS, 4, { min: 1, max: 30 }),
    retentionDays: numberSetting(env.HMI_CAMERA_RETENTION_DAYS, 30, { min: 1, max: 3650 }),
    maxIncidents: numberSetting(env.HMI_CAMERA_MAX_INCIDENTS, 50, { min: 1, max: 1000 }),
  };
}

function ffconcatQuote(path) {
  return `'${String(path).replaceAll("'", "'\\''")}'`;
}

function runProcess(command, args, { timeoutMs = 60_000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    let timer = null;
    let settled = false;

    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (error) reject(error);
      else resolve(result);
    };

    child.stderr?.on("data", (chunk) => {
      stderr = `${stderr}${chunk}`.slice(-8000);
    });
    child.once("error", (error) => finish(error));
    child.once("close", (code, signal) => {
      if (code === 0) finish(null, { stderr });
      else finish(new Error(`${command} stopte met code ${code ?? signal}: ${stderr.trim()}`));
    });

    timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(new Error(`${command} overschreed de tijdslimiet`));
    }, timeoutMs);
  });
}

async function defaultAssembleClip(config, segments, temporaryClip, concatList) {
  const content = `${segments.map((path) => `file ${ffconcatQuote(path)}`).join("\n")}\n`;
  await writeFile(concatList, content, { mode: 0o600 });
  await runProcess(config.ffmpegPath, [
    "-nostdin",
    "-hide_banner",
    "-loglevel", "warning",
    "-f", "concat",
    "-safe", "0",
    "-i", concatList,
    "-an",
    "-c", "copy",
    "-movflags", "+faststart",
    "-y",
    temporaryClip,
  ]);
}

async function defaultProbeDuration(config, clipPath) {
  return new Promise((resolve) => {
    const child = spawn(config.ffprobePath, [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      clipPath,
    ], { stdio: ["ignore", "pipe", "ignore"] });
    let stdout = "";
    child.stdout?.on("data", (chunk) => stdout += chunk);
    child.once("error", () => resolve(null));
    child.once("close", (code) => {
      const duration = Number(stdout.trim());
      resolve(code === 0 && Number.isFinite(duration) ? duration : null);
    });
  });
}

async function defaultCreateThumbnail(config, clipPath, thumbnailPath) {
  await runProcess(config.ffmpegPath, [
    "-nostdin",
    "-hide_banner",
    "-loglevel", "warning",
    "-ss", "1",
    "-i", clipPath,
    "-frames:v", "1",
    "-vf", "scale=480:-2",
    "-q:v", "4",
    "-y",
    thumbnailPath,
  ]);
}

function incidentId(faultAt, faultCode, existingIds) {
  const timestamp = faultAt.replace(/\D/g, "").slice(0, 17);
  const code = Math.max(0, Number(faultCode) || 0);
  const base = `${timestamp}Z-fault-${code}`;
  let id = base;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function publicIncident(incident) {
  if (!incident) return null;
  return {
    id: incident.id,
    faultAt: incident.faultAt,
    faultCode: incident.faultCode,
    faultMessage: incident.faultMessage || null,
    durationSeconds: incident.durationSeconds ?? null,
    sizeBytes: incident.sizeBytes,
    thumbnailAvailable: Boolean(incident.thumbnailAvailable),
    createdAt: incident.createdAt || incident.faultAt,
  };
}

export class CycleFaultVideoRecorder {
  constructor(config, dependencies = {}) {
    this.config = { ...config };
    this.spawnCapture = dependencies.spawnCapture || (() => spawn(
      this.config.ffmpegPath,
      this.captureArguments(),
      { stdio: ["ignore", "ignore", "pipe"] },
    ));
    this.assembleClip = dependencies.assembleClip || defaultAssembleClip;
    this.probeDuration = dependencies.probeDuration || defaultProbeDuration;
    this.createThumbnail = dependencies.createThumbnail || defaultCreateThumbnail;
    this.sleep = dependencies.sleep || ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
    this.now = dependencies.now || (() => new Date());
    this.onEvent = dependencies.onEvent || (() => {});

    this.workDir = join(this.config.storageDir, "ring");
    this.incidentsDir = join(this.config.storageDir, "incidents");
    this.state = this.config.enabled ? "idle" : "disabled";
    this.captureProcess = null;
    this.captureError = "";
    this.error = null;
    this.incidents = [];
    this.lastProductionActive = false;
    this.lastFaultActive = false;
    this.postFaultUntil = null;
    this.pruneTimer = null;
    this.operation = Promise.resolve();
    this.stoppingChildren = new WeakSet();
  }

  captureArguments() {
    const input = this.config.sourceUrl
      ? ["-f", "mpjpeg", "-i", this.config.sourceUrl]
      : [
          "-f", "v4l2",
          "-input_format", this.config.inputFormat,
          "-framerate", String(this.config.fps),
          "-video_size", `${this.config.width}x${this.config.height}`,
          "-i", this.config.device,
        ];
    return [
      "-nostdin",
      "-hide_banner",
      "-loglevel", "warning",
      ...input,
      "-an",
      "-r", String(this.config.fps),
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-pix_fmt", "yuv420p",
      "-g", String(Math.max(1, Math.round(this.config.fps * 2))),
      "-f", "segment",
      "-segment_time", String(this.config.segmentSeconds),
      "-reset_timestamps", "1",
      "-segment_format", "matroska",
      join(this.workDir, "segment-%06d.mkv"),
    ];
  }

  async initialize() {
    if (!this.config.enabled) return;
    await mkdir(this.config.storageDir, { recursive: true, mode: 0o750 });
    await chmod(this.config.storageDir, 0o750);
    await mkdir(this.incidentsDir, { recursive: true, mode: 0o750 });
    await chmod(this.incidentsDir, 0o750);
    await this.cleanupRing();
    await this.loadIncidents();
    await this.enforceRetention();
    this.state = this.incidents.length ? "fault-ready" : "idle";
  }

  async loadIncidents() {
    const names = await readdir(this.incidentsDir);
    const loaded = [];
    for (const name of names.filter((item) => /^[A-Za-z0-9-]+\.json$/.test(item))) {
      try {
        const id = name.slice(0, -5);
        const metadata = JSON.parse(await readFile(join(this.incidentsDir, name), "utf8"));
        if (metadata.id !== id || !Number.isFinite(Date.parse(metadata.faultAt))) continue;
        const clipPath = join(this.incidentsDir, `${id}.mp4`);
        const clipInfo = await stat(clipPath);
        let thumbnailAvailable = false;
        const thumbnailPath = join(this.incidentsDir, `${id}.jpg`);
        try {
          await stat(thumbnailPath);
          thumbnailAvailable = true;
        } catch {}
        loaded.push({
          ...metadata,
          sizeBytes: clipInfo.size,
          thumbnailAvailable,
          clipPath,
          thumbnailPath,
        });
      } catch {}
    }
    this.incidents = loaded.sort((a, b) => Date.parse(b.faultAt) - Date.parse(a.faultAt));
  }

  observe({ productionActive, faultActive, faultCode = 0, faultMessage = null }) {
    if (!this.config.enabled) return Promise.resolve();
    const production = Boolean(productionActive);
    const fault = Boolean(faultActive);
    const productionRising = production && !this.lastProductionActive;
    const productionFalling = !production && this.lastProductionActive;
    const faultRising = fault && !this.lastFaultActive;

    this.lastProductionActive = production;
    this.lastFaultActive = fault;

    if (faultRising) {
      return this.enqueue(() => this.preserveFault({ faultCode, faultMessage }));
    }
    if (productionRising) {
      return this.enqueue(() => this.startBuffering());
    }
    if (productionFalling && !fault) {
      return this.enqueue(() => this.discardRing());
    }
    return Promise.resolve();
  }

  enqueue(operation) {
    const next = this.operation.then(operation, operation);
    this.operation = next.catch(() => {});
    return next;
  }

  async startBuffering() {
    if (this.captureProcess) return;
    await this.cleanupRing();
    this.error = null;
    this.captureError = "";
    this.postFaultUntil = null;
    this.state = "buffering";

    let child;
    try {
      child = this.spawnCapture(this.config);
    } catch (error) {
      this.setError(`Camera-opname kon niet starten: ${error.message}`);
      return;
    }
    this.captureProcess = child;
    child.stderr?.on("data", (chunk) => {
      this.captureError = `${this.captureError}${chunk}`.slice(-4000);
    });
    child.once("error", (error) => {
      if (this.captureProcess === child) {
        this.captureProcess = null;
        this.setError(`Camera-opname kon niet starten: ${error.message}`);
      }
    });
    child.once("close", (code, signal) => {
      if (this.captureProcess !== child) return;
      this.captureProcess = null;
      this.clearPruneTimer();
      if (!this.stoppingChildren.has(child)) {
        const detail = this.captureError.trim() || `code ${code ?? signal}`;
        this.setError(`Camera-opname onverwacht gestopt: ${detail}`);
      }
    });

    this.pruneTimer = setInterval(
      () => this.pruneSegments().catch((error) => this.setError(`Videobuffer opschonen mislukt: ${error.message}`)),
      Math.max(1000, this.config.segmentSeconds * 1000),
    );
    this.emit("info", "Videobuffer gestart bij productiecyclus");
  }

  async preserveFault({ faultCode, faultMessage }) {
    if (!this.captureProcess && this.state !== "buffering") return;
    const faultAt = this.now().toISOString();
    if (this.config.postFaultSeconds > 0) {
      this.state = "post-fault";
      this.postFaultUntil = new Date(
        this.now().getTime() + this.config.postFaultSeconds * 1000,
      ).toISOString();
      this.emit("info", `Nog ${this.config.postFaultSeconds} seconden video na fout vastleggen`);
      await this.sleep(this.config.postFaultSeconds * 1000);
    }
    this.state = "finalizing";
    this.postFaultUntil = null;

    const existingIds = new Set(this.incidents.map((incident) => incident.id));
    const id = incidentId(faultAt, faultCode, existingIds);
    const clipPath = join(this.incidentsDir, `${id}.mp4`);
    const metadataPath = join(this.incidentsDir, `${id}.json`);
    const thumbnailPath = join(this.incidentsDir, `${id}.jpg`);
    const temporaryClip = join(this.config.storageDir, `.${id}-${process.pid}.tmp.mp4`);
    const temporaryMetadata = join(this.config.storageDir, `.${id}-${process.pid}.tmp.json`);
    const temporaryThumbnail = join(this.config.storageDir, `.${id}-${process.pid}.tmp.jpg`);
    const concatList = join(this.config.storageDir, `.${id}-${process.pid}.concat.txt`);
    let committed = false;

    try {
      await this.stopCapture();
      await this.pruneSegments();
      const limit = Math.ceil(this.config.bufferSeconds / this.config.segmentSeconds) + 2;
      const segments = (await this.listSegments()).slice(-limit);
      if (segments.length === 0) throw new Error("geen complete videosegmenten beschikbaar");

      await Promise.all([
        rm(temporaryClip, { force: true }),
        rm(temporaryMetadata, { force: true }),
        rm(temporaryThumbnail, { force: true }),
        rm(concatList, { force: true }),
      ]);
      await this.assembleClip(this.config, segments, temporaryClip, concatList);
      const temporaryInfo = await stat(temporaryClip);
      if (temporaryInfo.size === 0) throw new Error("samengesteld videobestand is leeg");
      const durationSeconds = await this.probeDuration(this.config, temporaryClip);

      let thumbnailAvailable = false;
      try {
        await this.createThumbnail(this.config, temporaryClip, temporaryThumbnail);
        await chmod(temporaryThumbnail, 0o640);
        thumbnailAvailable = true;
      } catch (error) {
        this.emit("warning", `Thumbnail voor storingvideo mislukt: ${error.message}`);
      }

      const metadata = {
        id,
        faultAt,
        faultCode: Number(faultCode || 0),
        faultMessage: faultMessage ? String(faultMessage).slice(0, 500) : null,
        durationSeconds,
        sizeBytes: temporaryInfo.size,
        thumbnailAvailable,
        createdAt: this.now().toISOString(),
      };
      await writeFile(temporaryMetadata, `${JSON.stringify(metadata, null, 2)}\n`, { mode: 0o640 });
      await chmod(temporaryClip, 0o640);
      await rename(temporaryClip, clipPath);
      if (thumbnailAvailable) await rename(temporaryThumbnail, thumbnailPath);
      await rename(temporaryMetadata, metadataPath);
      committed = true;

      this.incidents.unshift({ ...metadata, clipPath, thumbnailPath });
      await this.enforceRetention();
      this.error = null;
      this.state = "fault-ready";
      this.emit("info", `Storingvideo ${id} opgeslagen voor fout ${metadata.faultCode}`);
    } catch (error) {
      this.setError(`Storingvideo opslaan mislukt: ${error.message}`);
    } finally {
      await Promise.all([
        rm(temporaryClip, { force: true }),
        rm(temporaryMetadata, { force: true }),
        rm(temporaryThumbnail, { force: true }),
        rm(concatList, { force: true }),
      ]);
      if (!committed) {
        await Promise.all([
          rm(clipPath, { force: true }),
          rm(metadataPath, { force: true }),
          rm(thumbnailPath, { force: true }),
        ]);
      }
      await this.cleanupRing();
    }
  }

  async discardRing() {
    if (!this.captureProcess && this.state !== "buffering") return;
    await this.stopCapture();
    await this.cleanupRing();
    this.error = null;
    this.state = this.incidents.length ? "fault-ready" : "idle";
    this.emit("info", "Videobuffer gewist na normale cyclus");
  }

  async stopCapture() {
    const child = this.captureProcess;
    if (!child) return;
    this.stoppingChildren.add(child);
    this.clearPruneTimer();

    await new Promise((resolve) => {
      let settled = false;
      let termTimer = null;
      let killTimer = null;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(termTimer);
        clearTimeout(killTimer);
        resolve();
      };
      child.once("close", finish);
      child.once("error", finish);
      child.kill("SIGINT");
      termTimer = setTimeout(() => child.kill("SIGTERM"), 3000);
      killTimer = setTimeout(() => {
        child.kill("SIGKILL");
        finish();
      }, 6000);
    });
    if (this.captureProcess === child) this.captureProcess = null;
  }

  async listSegments() {
    let names = [];
    try {
      names = await readdir(this.workDir);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    return names
      .filter((name) => /^segment-\d{6}\.mkv$/.test(name))
      .sort()
      .map((name) => join(this.workDir, name));
  }

  async pruneSegments() {
    const segments = await this.listSegments();
    const limit = Math.ceil(this.config.bufferSeconds / this.config.segmentSeconds) + 2;
    if (segments.length <= limit) return;
    await Promise.all(segments.slice(0, -limit).map((path) => rm(path, { force: true })));
  }

  async cleanupRing() {
    await rm(this.workDir, { recursive: true, force: true });
    await mkdir(this.workDir, { recursive: true, mode: 0o750 });
  }

  async enforceRetention() {
    const cutoff = this.now().getTime() - this.config.retentionDays * 24 * 60 * 60 * 1000;
    const sorted = [...this.incidents].sort((a, b) => Date.parse(b.faultAt) - Date.parse(a.faultAt));
    const keep = [];
    const remove = [];
    sorted.forEach((incident, index) => {
      if (index < this.config.maxIncidents && Date.parse(incident.faultAt) >= cutoff) keep.push(incident);
      else remove.push(incident);
    });
    await Promise.all(remove.flatMap((incident) => [
      rm(incident.clipPath, { force: true }),
      rm(join(this.incidentsDir, `${incident.id}.json`), { force: true }),
      rm(incident.thumbnailPath, { force: true }),
    ]));
    this.incidents = keep;
    if (remove.length) this.emit("info", `${remove.length} oude storingvideo('s) verwijderd volgens retentiebeleid`);
  }

  listIncidents() {
    return this.incidents.map(publicIncident);
  }

  getIncident(id) {
    if (!/^[A-Za-z0-9-]+$/.test(String(id || ""))) return null;
    return this.incidents.find((incident) => incident.id === id) || null;
  }

  latestIncident() {
    return this.incidents[0] || null;
  }

  clearPruneTimer() {
    if (this.pruneTimer) clearInterval(this.pruneTimer);
    this.pruneTimer = null;
  }

  setError(message) {
    this.error = message;
    this.state = "error";
    this.emit("error", message);
  }

  emit(level, message) {
    this.onEvent({ level, message });
  }

  status() {
    const latest = this.latestIncident();
    return {
      enabled: this.config.enabled,
      state: this.state,
      recording: Boolean(this.captureProcess),
      clipAvailable: Boolean(latest),
      incidentCount: this.incidents.length,
      latestIncident: publicIncident(latest),
      bufferSeconds: this.config.bufferSeconds,
      postFaultSeconds: this.config.postFaultSeconds,
      postFaultUntil: this.postFaultUntil,
      retentionDays: this.config.retentionDays,
      maxIncidents: this.config.maxIncidents,
      resolution: `${this.config.width}x${this.config.height}`,
      fps: this.config.fps,
      faultAt: latest?.faultAt || null,
      faultCode: latest?.faultCode ?? null,
      durationSeconds: latest?.durationSeconds ?? null,
      sizeBytes: latest?.sizeBytes ?? null,
      error: this.error,
    };
  }

  async shutdown() {
    await this.enqueue(async () => {
      await this.stopCapture();
      await this.cleanupRing();
      this.state = this.config.enabled ? (this.incidents.length ? "fault-ready" : "idle") : "disabled";
    });
  }
}

function invalidRange(res, size) {
  res.writeHead(416, {
    "Accept-Ranges": "bytes",
    "Content-Range": `bytes */${size}`,
    "Cache-Control": "no-store",
  });
  res.end();
}

export async function serveVideoFile(req, res, clipPath) {
  let clipInfo;
  try {
    clipInfo = await stat(clipPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      res.end(JSON.stringify({ error: "Geen storingvideo beschikbaar" }));
      return;
    }
    throw error;
  }

  const size = clipInfo.size;
  const headers = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "Content-Disposition": "inline",
    "Content-Type": "video/mp4",
    "X-Content-Type-Options": "nosniff",
  };
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, { ...headers, "Content-Length": size });
    if (req.method === "HEAD") res.end();
    else createReadStream(clipPath).pipe(res);
    return;
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return invalidRange(res, size);

  let start;
  let end;
  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return invalidRange(res, size);
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= size || end < start) {
    return invalidRange(res, size);
  }
  end = Math.min(end, size - 1);
  res.writeHead(206, {
    ...headers,
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${size}`,
  });
  if (req.method === "HEAD") res.end();
  else createReadStream(clipPath, { start, end }).pipe(res);
}

export async function serveThumbnail(req, res, thumbnailPath) {
  try {
    const info = await stat(thumbnailPath);
    res.writeHead(200, {
      "Cache-Control": "private, max-age=300",
      "Content-Length": info.size,
      "Content-Type": "image/jpeg",
      "X-Content-Type-Options": "nosniff",
    });
    if (req.method === "HEAD") res.end();
    else createReadStream(thumbnailPath).pipe(res);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify({ error: "Geen thumbnail beschikbaar" }));
  }
}
