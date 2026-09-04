import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  defaultOutputPath as ioMapPath,
  loadAndRender,
} from "./generate-m31-io-map.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "fairino", "source");
const outputPath = path.join(
  repoRoot,
  "fairino",
  "programs",
  "mini_cell_production_m31_latest.lua",
);

const parts = [
  "config.lua",
  "io_map_generated.lua",
  "io_m31_production.lua",
  "hmi_modbus.lua",
  "motion.lua",
  "station_filter_dispenser.lua",
  "station_clamp.lua",
  "station_glue.lua",
  "state_machine_once.lua",
];

async function build() {
  const expectedMap = await loadAndRender();
  const storedMap = await readFile(ioMapPath, "utf8");
  if (storedMap !== expectedMap) {
    throw new Error("M31 I/O map is stale; run npm run generate:m31-io first.");
  }

  const output = [
    "-- Generated FAIRINO FR5 production program.",
    "-- All ordinary process I/O uses the Ebyte M31 over Modbus TCP.",
    "-- Safety functions remain hardwired; M31 safety feedback is diagnostic only.",
    "-- Source of truth: specs/fairino-field-device-handoff-v4-existing-project.json",
    "",
  ];
  for (const part of parts) {
    let content = await readFile(path.join(sourceRoot, part), "utf8");
    if (part === "config.lua") {
      content = content.replace(/^HMI_MODBUS_ENABLED = 0$/m, "HMI_MODBUS_ENABLED = 1");
    }
    output.push(`-- BEGIN ${part}`, content.trimEnd(), `-- END ${part}`, "");
  }
  const rendered = output.join("\n");
  if (/\bSetDO\s*\(|\bGetDI\s*\(/.test(rendered)) {
    throw new Error("Production program still contains direct FAIRINO field I/O calls.");
  }
  if (/remote_io_write_output|REMOTE_IO_OUTPUT_MIRROR_ENABLED\s*=\s*1/.test(rendered)) {
    throw new Error("Production program still contains the test-setup output mirror.");
  }
  if (!/ModbusMasterWriteDO\s*\(/.test(rendered) || !/ModbusMasterReadDI\s*\(/.test(rendered)) {
    throw new Error("Production program lacks the M31 Modbus I/O implementation.");
  }
  await writeFile(outputPath, rendered, "utf8");
  console.log(path.relative(repoRoot, outputPath));
}

await build();
