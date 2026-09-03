import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sharedRoot = resolve(repositoryRoot, "vendor/shared-data");

function readJson(path) {
  return JSON.parse(readFileSync(resolve(repositoryRoot, path), "utf8"));
}

function fail(message) {
  throw new Error(message);
}

const lock = readJson("config/shared-data-release-lock.json");
const payload = readJson("specs/fairino-io-handoff-v3-existing-project.json");
const catalog = readJson("vendor/shared-data/catalog/catalog.json");
const handoffSchema = readJson("vendor/shared-data/contracts/v3/fairino-io-handoff.schema.json");
const sharedCommit = execFileSync("git", ["-C", sharedRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();

if (sharedCommit !== lock.commit) fail(`Shared submodule ${sharedCommit} does not match lock ${lock.commit}.`);
if (catalog.catalogId !== payload.library.catalogId || catalog.catalogId !== "rd-technical-library") {
  fail("Payload and shared catalog use different catalog IDs.");
}
if (catalog.catalogVersion !== payload.library.catalogVersion || catalog.catalogVersion !== lock.tag.slice(1)) {
  fail("Payload, shared catalog and release lock use different catalog versions.");
}
if (payload.library.commit !== lock.commit) fail("Payload commit does not match the release lock.");

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate = ajv.compile(handoffSchema);
if (!validate(payload)) {
  fail(`Payload violates the V3 contract:\n${ajv.errorsText(validate.errors, { separator: "\n" })}`);
}

const catalogItems = new Map(catalog.items.map((item) => [item.libraryItemId, item]));
const fieldDevices = new Map();
for (const device of payload.fieldDevices) {
  if (fieldDevices.has(device.id)) fail(`Duplicate field-device ID: ${device.id}`);
  fieldDevices.set(device.id, device);

  const item = catalogItems.get(device.libraryItemId);
  if (!item) fail(`Unknown library item for ${device.id}: ${device.libraryItemId}`);
  if (item.domain !== "component" || !item.technicalData?.engineering?.fieldDevice) {
    fail(`${device.libraryItemId} is not a process field device.`);
  }
  if (item.identityStatus === "legacy-alias") fail(`${device.libraryItemId} is a legacy alias, not a canonical selection.`);
  if (item.itemVersion !== device.libraryVersion) {
    fail(`${device.id} uses v${device.libraryVersion}; ${device.libraryItemId} requires v${item.itemVersion}.`);
  }
  if (item.identityStatus === "needs-review" && device.catalogReviewAcceptance !== "accepted-for-project-use") {
    fail(`${device.id} must explicitly accept the needs-review catalog item.`);
  }
}

const assignmentIds = new Set();
const controllerChannels = new Set();
const assignedDevices = new Set();
const directionCounts = new Map();
for (const assignment of payload.ioAssignments) {
  if (assignmentIds.has(assignment.id)) fail(`Duplicate I/O assignment ID: ${assignment.id}`);
  assignmentIds.add(assignment.id);

  const device = fieldDevices.get(assignment.deviceEndpoint.fieldDeviceId);
  if (!device) fail(`${assignment.id} references an unknown field device.`);
  assignedDevices.add(device.id);

  const item = catalogItems.get(device.libraryItemId);
  const portIds = new Set((item.technicalData.terminals ?? []).map((terminal) => terminal.id));
  for (const portId of assignment.deviceEndpoint.portIds) {
    if (!portIds.has(portId)) fail(`${assignment.id} references unknown port ${device.libraryItemId}/${portId}.`);
  }

  const channelKey = `${assignment.controllerEndpoint.controllerId}/${assignment.controllerEndpoint.channelId}`;
  if (controllerChannels.has(channelKey)) fail(`Controller channel is assigned twice: ${channelKey}`);
  controllerChannels.add(channelKey);
  directionCounts.set(assignment.direction, (directionCounts.get(assignment.direction) ?? 0) + 1);
}

for (const deviceId of fieldDevices.keys()) {
  if (!assignedDevices.has(deviceId)) fail(`Selected field device has no I/O assignment: ${deviceId}`);
}

if (fieldDevices.size !== 24 || payload.ioAssignments.length !== 28) {
  fail(`Production payload count changed: ${fieldDevices.size} devices, ${payload.ioAssignments.length} assignments.`);
}
if (directionCounts.get("digital-input") !== 18 || directionCounts.get("digital-output") !== 10) {
  fail(`Production I/O count changed: ${directionCounts.get("digital-input") ?? 0} DI, ${directionCounts.get("digital-output") ?? 0} DO.`);
}

console.log(
  `Validated FAIRINO V3 handoff against ${lock.tag} (${lock.commit}): `
  + `${fieldDevices.size} field devices, ${directionCounts.get("digital-input")} DI, ${directionCounts.get("digital-output")} DO.`
);
