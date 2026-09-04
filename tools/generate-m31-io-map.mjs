import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const defaultHandoffPath = path.join(
  repoRoot,
  "specs",
  "fairino-field-device-handoff-v4-existing-project.json",
);
export const defaultOutputPath = path.join(
  repoRoot,
  "fairino",
  "source",
  "io_map_generated.lua",
);
export const defaultDocumentationPath = path.join(
  repoRoot,
  "docs",
  "hardware",
  "m31-production-io-map.generated.md",
);

const requiredPin = Object.freeze({
  catalogVersion: "0.1.0-rc.23",
  commit: "fd26d46cdb2bc23d41874e210aa2ed4791e793a7",
});

function fail(message) {
  throw new Error(message);
}

function unique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function addressValue(signal, namespace) {
  const matches = signal.controllerEndpoint.addresses.filter(
    (address) => address.namespace === namespace,
  );
  if (matches.length !== 1) {
    fail(`${signal.signalName} must have exactly one ${namespace} address.`);
  }
  return matches[0].value;
}

function integerAddress(signal, namespace) {
  const value = addressValue(signal, namespace);
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    fail(`${signal.signalName} has invalid ${namespace} address: ${value}`);
  }
  return Number(value);
}

function validateEndpoint(signal) {
  const endpoint = signal.controllerEndpoint;
  const channelMatch = /^(DI|DO)([1-9][0-9]*)$/.exec(endpoint.channelId);
  if (!channelMatch) fail(`${signal.signalName} has invalid M31 channelId.`);
  const channelNumber = Number(channelMatch[2]);
  const physicalChannel = addressValue(signal, "m31-physical");
  if (physicalChannel !== endpoint.channelId) {
    fail(`${signal.signalName} physical channel differs from channelId.`);
  }

  if (signal.direction === "digital-output") {
    if (endpoint.controllerId !== "existing-m31-do-expansion") {
      fail(`${signal.signalName} is not assigned to the M31 DO expansion.`);
    }
    if (channelMatch[1] !== "DO" || channelNumber > 16) {
      fail(`${signal.signalName} has an invalid M31 output channel.`);
    }
    const address = integerAddress(signal, "modbus-coil-zero-based");
    if (address !== channelNumber - 1) {
      fail(`${signal.signalName} coil address does not match ${endpoint.channelId}.`);
    }
    return address;
  }

  if (signal.direction !== "digital-input") {
    fail(`${signal.signalName} is not a supported digital M31 signal.`);
  }
  if (channelMatch[1] !== "DI" || channelNumber > 16) {
    fail(`${signal.signalName} has an invalid M31 input channel.`);
  }
  const address = integerAddress(signal, "modbus-discrete-input-zero-based");
  if (endpoint.controllerId === "existing-m31-di-host") {
    if (address !== channelNumber - 1) {
      fail(`${signal.signalName} host input address does not match ${endpoint.channelId}.`);
    }
    return address;
  }
  if (endpoint.controllerId === "existing-m31-di-expansion") {
    if (address !== 15 + channelNumber) {
      fail(`${signal.signalName} expansion address does not match ${endpoint.channelId}.`);
    }
    const globalInput = addressValue(signal, "project-global-input");
    if (globalInput !== `DI${address + 1}`) {
      fail(`${signal.signalName} has an inconsistent project-global-input.`);
    }
    return address;
  }
  fail(`${signal.signalName} is not assigned to an approved M31 DI endpoint.`);
}

export function validateProductionHandoff(handoff) {
  if (handoff.schemaVersion !== 4) fail("Production handoff must use schemaVersion 4.");
  if (handoff.handoffType !== "fairino-to-electrical-schema-app") {
    fail("Unexpected handoffType.");
  }
  if (handoff.projectMode !== "existing-schema-project") {
    fail("This robot cell must use existing-schema-project mode.");
  }
  if (
    handoff.robotPlatform?.manufacturer !== "FAIRINO" ||
    handoff.robotPlatform?.model !== "FR5"
  ) {
    fail("Production handoff must be limited to FAIRINO FR5.");
  }
  if (
    handoff.library?.catalogVersion !== requiredPin.catalogVersion ||
    handoff.library?.commit !== requiredPin.commit
  ) {
    fail("Production handoff is not pinned to SHARED_DATA_SCHEMA_FAIRINO rc.23.");
  }

  unique(handoff.fieldDevices.map((device) => device.id), "field-device id");
  unique(handoff.fieldDevices.map((device) => device.deviceName), "deviceName");
  for (const device of handoff.fieldDevices) {
    if (!/^\S(?:.*\S)? [1-9][0-9]*$/.test(device.deviceName)) {
      fail(`${device.id} has an invalid numbered physical deviceName.`);
    }
    if (!device.processLocation?.trim() || !device.functionDescription?.trim()) {
      fail(`${device.id} lacks presentation data.`);
    }
  }

  const signals = handoff.fieldDevices.flatMap((device) =>
    device.io.map((signal) => ({ ...signal, device })),
  );
  unique(signals.map((signal) => signal.signalName), "signalName");
  unique(
    signals.map(
      (signal) =>
        `${signal.controllerEndpoint?.controllerId}:${signal.controllerEndpoint?.channelId}`,
    ),
    "M31 channel",
  );
  for (const signal of signals) {
    if (signal.assignmentStatus !== "assigned" || !signal.controllerEndpoint) {
      fail(`${signal.signalName} is not assigned.`);
    }
    if (signal.controllerEndpoint.addresses.some((address) => address.namespace === "fairino-mirror")) {
      fail(`${signal.signalName} still contains a FAIRINO mirror address.`);
    }
    signal.modbusAddress = validateEndpoint(signal);
  }

  const dispenserSignals = signals.filter(
    (signal) => signal.device.libraryItemId === "gtric-e3f-18s10n1",
  );
  if (
    dispenserSignals.length !== 6 ||
    dispenserSignals.some(
      (signal) => signal.controllerEndpoint.controllerId !== "existing-m31-di-expansion",
    )
  ) {
    fail("The six NPN dispenser sensors must share the M31 DI expansion group.");
  }
  const pnpSensorIds = new Set([
    "dmsh-pnp-magnetic-cylinder-sensor",
    "gtric-e3x-na41",
    "ifm-pn3094-pressure-sensor",
  ]);
  if (
    signals.some(
      (signal) =>
        signal.direction === "digital-input" &&
        pnpSensorIds.has(signal.device.libraryItemId) &&
        signal.controllerEndpoint.controllerId !== "existing-m31-di-host",
    )
  ) {
    fail("PNP process sensors must be assigned to the M31 DI host groups.");
  }
  return signals;
}

function luaString(value) {
  return JSON.stringify(value);
}

export function renderLuaMap(handoff) {
  const signals = validateProductionHandoff(handoff);
  const inputs = signals
    .filter((signal) => signal.direction === "digital-input")
    .sort((a, b) => a.modbusAddress - b.modbusAddress);
  const outputs = signals
    .filter((signal) => signal.direction === "digital-output")
    .sort((a, b) => a.modbusAddress - b.modbusAddress);

  const lines = [
    "-- Generated from specs/fairino-field-device-handoff-v4-existing-project.json.",
    "-- Do not edit this file by hand; run: npm run generate:m31-io",
    `-- Shared data: ${handoff.library.catalogVersion} / ${handoff.library.commit}`,
    "",
    "M31_DI_COUNT = 32",
    "M31_DO_COUNT = 16",
    "M31_DI_SAFETY_DIAGNOSTIC = 0",
    "",
    "-- Zero-based Modbus coil addresses.",
  ];
  for (const signal of outputs) lines.push(`${signal.signalName} = ${signal.modbusAddress}`);
  lines.push("", "-- Zero-based Modbus discrete-input addresses.");
  for (const signal of inputs) lines.push(`${signal.signalName} = ${signal.modbusAddress}`);
  lines.push(
    "",
    "FILTER_DISPENSER_INPUTS = {",
    ...Array.from({ length: 6 }, (_, index) => `    DI_FILTER_DISPENSER_${index + 1}_PRESENT,`),
    "}",
    "",
    "M31_IO_METADATA = {",
  );
  for (const signal of [...outputs, ...inputs]) {
    lines.push(
      `    [${luaString(signal.signalName)}] = {`,
      `        device_name = ${luaString(signal.device.deviceName)},`,
      `        process_location = ${luaString(signal.device.processLocation)},`,
      `        function_description = ${luaString(signal.device.functionDescription)},`,
      `        controller_id = ${luaString(signal.controllerEndpoint.controllerId)},`,
      `        channel_id = ${luaString(signal.controllerEndpoint.channelId)},`,
      `        modbus_address = ${signal.modbusAddress},`,
      `        safe_state = ${luaString(signal.safeState ?? "not-specified")},`,
      "    },",
    );
  }
  lines.push("}", "");
  return lines.join("\n");
}

export function renderMarkdownMap(handoff) {
  const signals = validateProductionHandoff(handoff);
  const rows = (direction) =>
    signals
      .filter((signal) => signal.direction === direction)
      .sort((a, b) => a.modbusAddress - b.modbusAddress)
      .map((signal) => {
        const controller = {
          "existing-m31-do-expansion": "M31 DO-uitbreiding",
          "existing-m31-di-host": "M31 DI-host",
          "existing-m31-di-expansion": "M31 DI-uitbreiding",
        }[signal.controllerEndpoint.controllerId];
        return (
          `| ${signal.device.deviceName} | ${signal.device.processLocation} | ${signal.device.functionDescription} | ` +
          `${signal.signalName} | ${controller} ${signal.controllerEndpoint.channelId} | ` +
          `${signal.modbusAddress} | ${signal.device.libraryItemId} v${signal.device.libraryVersion} |`
        );
      });
  return [
    "# M31 productie-I/O",
    "",
    "> Automatisch gegenereerd uit `specs/fairino-field-device-handoff-v4-existing-project.json`. Niet handmatig wijzigen.",
    "",
    `Centrale bron: SHARED_DATA_SCHEMA_FAIRINO ${handoff.library.catalogVersion}, commit \`${handoff.library.commit}\`.`,
    "",
    "Alle gewone proces-I/O loopt uitsluitend via M31. M31-host DI1 blijft gereserveerd voor bestaande safetydiagnose en is geen safetybesturing of FAIRINO-veldapparaat.",
    "",
    "## Digitale uitgangen",
    "",
    "| Apparaatnaam | Proceslocatie | Functie | Signaalnaam | Fysiek kanaal | Modbusadres (0-based) | Library-item |",
    "| --- | --- | --- | --- | --- | ---: | --- |",
    ...rows("digital-output"),
    "",
    "## Digitale ingangen",
    "",
    "| Apparaatnaam | Proceslocatie | Functie | Signaalnaam | Fysiek kanaal | Modbusadres (0-based) | Library-item |",
    "| --- | --- | --- | --- | --- | ---: | --- |",
    ...rows("digital-input"),
    "",
  ].join("\n");
}

export async function loadAndRender(handoffPath = defaultHandoffPath) {
  const handoff = JSON.parse(await readFile(handoffPath, "utf8"));
  return renderLuaMap(handoff);
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const handoff = JSON.parse(await readFile(defaultHandoffPath, "utf8"));
  const rendered = renderLuaMap(handoff);
  const documentation = renderMarkdownMap(handoff);
  if (checkOnly) {
    const existing = await readFile(defaultOutputPath, "utf8");
    if (existing !== rendered) fail("Generated M31 Lua I/O map is out of date.");
    const existingDocumentation = await readFile(defaultDocumentationPath, "utf8");
    if (existingDocumentation !== documentation) {
      fail("Generated M31 I/O documentation is out of date.");
    }
    console.log("Generated M31 Lua map and I/O documentation: up to date");
    return;
  }
  await writeFile(defaultOutputPath, rendered, "utf8");
  await writeFile(defaultDocumentationPath, documentation, "utf8");
  console.log(path.relative(repoRoot, defaultOutputPath));
  console.log(path.relative(repoRoot, defaultDocumentationPath));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
