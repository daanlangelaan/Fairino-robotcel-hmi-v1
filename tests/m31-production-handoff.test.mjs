import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  defaultHandoffPath,
  defaultDocumentationPath,
  defaultOutputPath,
  renderMarkdownMap,
  renderLuaMap,
  validateProductionHandoff,
} from "../tools/generate-m31-io-map.mjs";

async function handoff() {
  return JSON.parse(await readFile(defaultHandoffPath, "utf8"));
}

test("V4 production handoff contains the complete M31-only process I/O", async () => {
  const payload = await handoff();
  const signals = validateProductionHandoff(payload);

  assert.equal(payload.schemaVersion, 4);
  assert.equal(payload.projectMode, "existing-schema-project");
  assert.equal(payload.fieldDevices.length, 24);
  assert.equal(signals.filter((signal) => signal.direction === "digital-input").length, 18);
  assert.equal(signals.filter((signal) => signal.direction === "digital-output").length, 10);
  assert.ok(signals.every((signal) => signal.assignmentStatus === "assigned"));
  assert.ok(
    signals.every((signal) =>
      signal.controllerEndpoint.controllerId.startsWith("existing-m31-"),
    ),
  );
  assert.ok(
    signals.every((signal) =>
      signal.controllerEndpoint.addresses.every(
        (address) => address.namespace !== "fairino-mirror",
      ),
    ),
  );
});

test("physical device names are stable, numbered and separated from functions", async () => {
  const payload = await handoff();
  const names = payload.fieldDevices.map((device) => device.deviceName);

  assert.equal(new Set(names).size, names.length);
  assert.ok(names.every((name) => /^\S(?:.*\S)? [1-9][0-9]*$/.test(name)));
  assert.deepEqual(
    names.filter((name) => name.startsWith("Magneetventiel ")),
    ["Magneetventiel 1", "Magneetventiel 2", "Magneetventiel 3", "Magneetventiel 4"],
  );
  assert.deepEqual(
    names.filter((name) => name.startsWith("Fotocelsensor ")),
    Array.from({ length: 6 }, (_, index) => `Fotocelsensor ${index + 1}`),
  );
  assert.deepEqual(
    names.filter((name) => name.startsWith("Cilindersensor ")),
    Array.from({ length: 9 }, (_, index) => `Cilindersensor ${index + 1}`),
  );
  assert.ok(payload.fieldDevices.every((device) => device.processLocation.trim()));
  assert.ok(payload.fieldDevices.every((device) => device.functionDescription.trim()));
});

test("NPN dispenser sensors and PNP process sensors use separate M31 hardware", async () => {
  const payload = await handoff();
  const inputs = payload.fieldDevices.flatMap((device) =>
    device.io
      .filter((signal) => signal.direction === "digital-input")
      .map((signal) => ({ device, signal })),
  );
  const npn = inputs.filter(
    ({ device }) => device.libraryItemId === "gtric-e3f-18s10n1",
  );
  const pnpIds = new Set([
    "dmsh-pnp-magnetic-cylinder-sensor",
    "gtric-e3x-na41",
    "ifm-pn3094-pressure-sensor",
  ]);
  const pnp = inputs.filter(({ device }) => pnpIds.has(device.libraryItemId));

  assert.equal(npn.length, 6);
  assert.ok(
    npn.every(
      ({ signal }) =>
        signal.controllerEndpoint.controllerId === "existing-m31-di-expansion",
    ),
  );
  assert.equal(pnp.length, 12);
  assert.ok(
    pnp.every(
      ({ signal }) => signal.controllerEndpoint.controllerId === "existing-m31-di-host",
    ),
  );
});

test("generated Lua map is byte-for-byte derived from the V4 handoff", async () => {
  const payload = await handoff();
  assert.equal(await readFile(defaultOutputPath, "utf8"), renderLuaMap(payload));
  assert.equal(
    await readFile(defaultDocumentationPath, "utf8"),
    renderMarkdownMap(payload),
  );
});

test("production Lua uses M31 Modbus and excludes direct controller field I/O", async () => {
  const [driver, program] = await Promise.all([
    readFile(new URL("../fairino/source/io_m31_production.lua", import.meta.url), "utf8"),
    readFile(
      new URL("../fairino/programs/mini_cell_production_m31_latest.lua", import.meta.url),
      "utf8",
    ),
  ]);

  for (const source of [driver, program]) {
    assert.doesNotMatch(source, /\bSetDO\s*\(|\bGetDI\s*\(/);
    assert.match(source, /ModbusMasterReadDO\s*\(/);
    assert.match(source, /ModbusMasterWriteDO\s*\(/);
    assert.match(source, /ModbusMasterReadDI\s*\(/);
  }
  assert.doesNotMatch(program, /remote_io_write_output/);
  assert.match(program, /M31_DI_SAFETY_DIAGNOSTIC = 0/);
  assert.match(program, /Safety functions remain hardwired/);
});
