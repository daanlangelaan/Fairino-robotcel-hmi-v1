import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import {
  defaultHandoffPath,
  validateProductionHandoff,
} from "./generate-m31-io-map.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = path.join(repoRoot, "config", "shared-data-release-lock.json");

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function fail(message) {
  throw new Error(message);
}

const sharedDataDir = path.resolve(
  argument("--shared-data-dir") ??
    process.env.SHARED_DATA_SCHEMA_DIR ??
    path.join(repoRoot, "vendor", "shared-data"),
);

const lock = JSON.parse(await readFile(lockPath, "utf8"));
const handoff = JSON.parse(await readFile(defaultHandoffPath, "utf8"));
const { stdout: checkoutCommit } = await execFileAsync(
  "git",
  ["rev-parse", "HEAD"],
  { cwd: sharedDataDir },
);
if (checkoutCommit.trim() !== lock.commit) {
  fail(`Shared-data checkout is ${checkoutCommit.trim()}, expected ${lock.commit}.`);
}

const schema = JSON.parse(
  await readFile(path.join(sharedDataDir, ...lock.handoffContract.split("/")), "utf8"),
);
const catalog = JSON.parse(
  await readFile(path.join(sharedDataDir, ...lock.catalog.split("/")), "utf8"),
);
if (catalog.catalogVersion !== lock.tag.replace(/^v/, "")) {
  fail("Catalog version does not match the locked tag.");
}
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateSchema = ajv.compile(schema);
if (!validateSchema(handoff)) {
  fail(`V4 schema validation failed: ${ajv.errorsText(validateSchema.errors)}`);
}
const signals = validateProductionHandoff(handoff);
const catalogItems = new Map(
  catalog.items.map((item) => [item.libraryItemId, item]),
);
for (const device of handoff.fieldDevices) {
  const item = catalogItems.get(device.libraryItemId);
  if (!item) fail(`Unknown catalog item: ${device.libraryItemId}`);
  if (item.itemVersion !== device.libraryVersion) {
    fail(`Library version mismatch on ${device.id}.`);
  }
  if (
    (item.status !== "approved" || item.identityStatus !== "canonical") &&
    device.catalogReviewAcceptance !== "accepted-for-project-use"
  ) {
    fail(`Catalog review acceptance missing on ${device.id}.`);
  }
  const ports = new Set(
    (item.technicalData?.terminals ?? []).map((terminal) => terminal.id),
  );
  for (const signal of device.io) {
    for (const portId of signal.devicePortIds) {
      if (!ports.has(portId)) {
        fail(`Unknown port ${device.libraryItemId}/${portId}.`);
      }
    }
  }
}

console.log(`Shared-data pin: ${lock.tag} / ${lock.commit}`);
console.log("V4 JSON Schema and central catalog references: OK");
console.log(
  `Production handoff: ${handoff.fieldDevices.length} devices, ` +
    `${signals.filter((signal) => signal.direction === "digital-input").length} DI, ` +
    `${signals.filter((signal) => signal.direction === "digital-output").length} DO`,
);
