import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { CameraSourceClient, cameraSourceConfigFromEnv } from "./camera-source.mjs";
import { controllerFaultMessage, overlayControllerFault } from "./controller-status.mjs";
import {
  CycleFaultVideoRecorder,
  serveThumbnail,
  serveVideoFile,
  videoRecorderConfigFromEnv,
} from "./cycle-video-recorder.mjs";
import { FairinoRpcClient, FairinoRpcError, normalizeProgramName } from "./fairino-rpc.mjs";
import { createSingleFlight, ModbusTcpClient } from "./modbus-client.mjs";
import {
  assertOutputTestInterlock,
  outputTestCoils,
  OutputTestRequestError,
  parseBooleanFlag,
  parseOutputTestRequest,
} from "./output-tests.mjs";

const root = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const port = Number(process.env.PORT || 8787);
const bindHost = process.env.HMI_BIND_HOST || "127.0.0.1";
const bridgeMode = process.env.HMI_BRIDGE_MODE || "mock";
const fairinoHost = process.env.FAIRINO_HOST || "192.168.58.2";
const fairinoPort = Number(process.env.FAIRINO_PORT || 502);
const fairinoRpcPort = Number(process.env.FAIRINO_RPC_PORT || 20003);
const fairinoProgramName = process.env.FAIRINO_PROGRAM_NAME
  || "mini_cell_a_cycle_order_hmi_reset_home_20260715_172115.lua";
const unitId = Number(process.env.FAIRINO_UNIT_ID || 1);
const outputTestsEnabled = parseBooleanFlag(process.env.HMI_OUTPUT_TESTS_ENABLED);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const states = [
  { code: "S00_INIT", value: 0, label: "Init" },
  { code: "S20_WAIT_READY", value: 20, label: "Ready check" },
  { code: "S30_WAIT_START", value: 30, label: "Wachten op start" },
  { code: "S40_SELECT_FILTER_DISPENSER", value: 40, label: "Filter kiezen" },
  { code: "S50_DISPENSE_FILTER", value: 50, label: "Filter klaarzetten" },
  { code: "S60_PICK_FILTER", value: 60, label: "Pick filter" },
  { code: "S70_PLACE_FILTER_IN_CLAMP", value: 70, label: "Filter in clamp" },
  { code: "S80_CLAMP_FILTER", value: 80, label: "Clamp filter" },
  { code: "S90_DISPENSE_CHECK_VALVE", value: 90, label: "Keerklep doseren" },
  { code: "S100_PICK_CHECK_VALVE", value: 100, label: "Pick keerklep" },
  { code: "S110_APPLY_GLUE", value: 110, label: "Lijm + J6" },
  { code: "S120_INSERT_CHECK_VALVE", value: 120, label: "Plaats keerklep" },
  { code: "S130_PRESS_CHECK_VALVE", value: 130, label: "Aandrukken" },
  { code: "S140_UNCLAMP_FILTER", value: 140, label: "Clamp open" },
  { code: "S150_PICK_FINISHED_FILTER", value: 150, label: "Pick gereed product" },
  { code: "S160_PLACE_IN_DRYING_ROW", value: 160, label: "Droogrij plaatsen" },
  { code: "S170_INDEX_DRYING_ROW", value: 170, label: "Droogrij indexeren" },
  { code: "S180_CYCLE_COMPLETE", value: 180, label: "Cyclus klaar" },
  { code: "S190_CHECK_NEXT_CYCLE", value: 190, label: "Volgende cyclus" },
  { code: "S800_MATERIAL_EMPTY", value: 800, label: "Materiaal leeg" },
  { code: "S850_BATCH_COMPLETE", value: 850, label: "Batch klaar" },
  { code: "S900_FAULT", value: 900, label: "Fault actief" },
  { code: "S910_WAIT_RESET", value: 910, label: "Wacht op reset" },
  { code: "S990_SAFETY_STOP", value: 990, label: "Safety stop" },
];

const coils = [
  { address: 100, name: "HMI_START_REQ", label: "Start request" },
  { address: 101, name: "HMI_RESET_REQ", label: "Reset request" },
  { address: 102, name: "HMI_STOP_REQ", label: "Stop request" },
  { address: 103, name: "HMI_AUTO_MODE_REQ", label: "Auto mode request" },
  { address: 104, name: "HMI_ACK_REQ", label: "Acknowledge request" },
  { address: 105, name: "HMI_ESTOP_REQ", label: "Emergency stop request" },
];

const holdingRegisters = [
  { address: 100, name: "HMI_BATCH_TARGET", label: "Batch target" },
  { address: 101, name: "HMI_HEARTBEAT", label: "HMI heartbeat" },
  { address: 102, name: "HMI_RECIPE", label: "Recipe" },
];

const discreteInputs = [
  { address: 100, name: "CELL_READY", label: "Ready" },
  { address: 101, name: "CELL_RUNNING", label: "Running" },
  { address: 102, name: "CELL_FAULT_ACTIVE", label: "Fault active" },
  { address: 103, name: "CELL_SAFETY_OK", label: "Safety OK" },
  { address: 104, name: "CELL_GLUE_ACTIVE", label: "Glue active" },
  { address: 105, name: "CELL_CLAMP_CLOSED", label: "Clamp closed" },
  { address: 106, name: "CELL_GRIPPER_OK", label: "Gripper OK" },
  { address: 107, name: "CELL_BATCH_COMPLETE", label: "Batch complete" },
  { address: 108, name: "CELL_COMMS_OK", label: "Comms OK" },
];

const inputRegisters = [
  { address: 100, name: "CELL_STATE", label: "Cell state" },
  { address: 101, name: "CELL_FAULT_CODE", label: "Fault code" },
  { address: 102, name: "CELL_CYCLE_COUNT", label: "Cycle count" },
  { address: 103, name: "CELL_BATCH_TARGET_ECHO", label: "Batch target echo" },
  { address: 104, name: "CELL_BATCH_DONE", label: "Batch done" },
  { address: 105, name: "CELL_ROBOT_HEARTBEAT", label: "Robot heartbeat" },
];

const simInputs = {
  safety_ok: true,
  filter_present: true,
  gripper_filter_present: true,
  clamp_closed: true,
};

const machine = {
  stateIndex: 0,
  faultCode: 0,
  cycleCount: 0,
  batchDone: 0,
  running: false,
  robotHeartbeat: 0,
  log: [],
};

const values = {
  coils: Object.fromEntries(coils.map((item) => [item.name, false])),
  holdingRegisters: {
    HMI_BATCH_TARGET: 10,
    HMI_HEARTBEAT: 0,
    HMI_RECIPE: 1,
  },
  discreteInputs: Object.fromEntries(discreteInputs.map((item) => [item.name, false])),
  inputRegisters: Object.fromEntries(inputRegisters.map((item) => [item.name, 0])),
};
let lastLuaHeartbeat = null;
let lastLuaHeartbeatChangeAt = 0;

const modbusClient = new ModbusTcpClient({
  host: fairinoHost,
  port: fairinoPort,
  unitId,
  timeout: 2000,
});
const fairinoRpc = new FairinoRpcClient({
  host: fairinoHost,
  port: fairinoRpcPort,
  timeout: 3000,
  verifyDelayMs: 1000,
});

let robotStartupAction = null;

function runRobotStartupAction(operation) {
  if (robotStartupAction) {
    throw new FairinoRpcError(
      "Een andere celopstart- of resetactie is al actief",
      409,
    );
  }

  const current = Promise.resolve().then(operation);
  robotStartupAction = current;
  current.finally(() => {
    if (robotStartupAction === current) robotStartupAction = null;
  }).catch(() => {});
  return current;
}

const enableCell = () => runRobotStartupAction(async () => {
  await readModbusSnapshot();
  const [programState, controllerError, loadedProgram] = await Promise.all([
    fairinoRpc.getProgramState(),
    fairinoRpc.getRobotErrorCode(),
    fairinoRpc.getLoadedProgram(),
  ]);

  if (controllerError.mainCode !== 0 || controllerError.subCode !== 0) {
    throw new FairinoRpcError(
      `Cel inschakelen geweigerd: controllerfout ${controllerError.mainCode}/${controllerError.subCode}; gebruik Reset nadat de oorzaak is opgelost`,
      409,
    );
  }
  if (values.coils.HMI_ESTOP_REQ) {
    throw new FairinoRpcError(
      "Cel inschakelen geweigerd: HMI-noodstop is actief; controleer de cel en gebruik Reset",
      409,
    );
  }
  if (programState === 2) {
    if (normalizeProgramName(loadedProgram) !== normalizeProgramName(fairinoProgramName)) {
      throw new FairinoRpcError(
        `Cel inschakelen geweigerd: onverwacht programma actief (${loadedProgram})`,
        409,
      );
    }
    const heartbeatBefore = Number(values.inputRegisters.CELL_ROBOT_HEARTBEAT || 0);
    const heartbeatAfter = await waitForLuaHeartbeat(heartbeatBefore);
    pushLog(`Cel is al ingeschakeld met ${normalizeProgramName(loadedProgram)}`);
    return { alreadyRunning: true, loadedProgram, heartbeatBefore, heartbeatAfter };
  }
  if (programState !== 1) {
    throw new FairinoRpcError(
      `Cel inschakelen geweigerd: Lua-programmastatus ${programState}; stop het programma eerst`,
      409,
    );
  }

  const startResult = await startConfiguredProgram();
  pushLog(
    `Cel ingeschakeld; ${normalizeProgramName(startResult.loadResult.loadedAfter)} actief na ${startResult.runResult.attempts} startpoging(en)`,
  );
  return startResult;
});

const recoverRobotAndRun = () => runRobotStartupAction(async () => {
  await readModbusSnapshot();
  const [programState, controllerError] = await Promise.all([
    fairinoRpc.getProgramState(),
    fairinoRpc.getRobotErrorCode(),
  ]);
  const runningHmiEstop = programState === 2
    && controllerError.mainCode === 0
    && controllerError.subCode === 0
    && values.coils.HMI_ESTOP_REQ
    && Number(values.inputRegisters.CELL_FAULT_CODE) === 991;

  if (runningHmiEstop) {
    await setModbusCoil("HMI_STOP_REQ", false);
    await setModbusCoil("HMI_ESTOP_REQ", false);
    await pulseModbusCoil("HMI_RESET_REQ", 5000);
    pushLog("HMI-noodstop 991 gewist; actief Lua-programma herstelt via reset request");
    return { recovery: "running-hmi-estop" };
  }

  const resetResult = await fairinoRpc.resetAllErrorsAndVerify();
  pushLog(
    `Fairino controller reset ${resetResult.before.mainCode}/${resetResult.before.subCode} -> 0/0`,
  );
  await setModbusCoil("HMI_STOP_REQ", false);
  await setModbusCoil("HMI_ESTOP_REQ", false);
  await pulseModbusCoil("HMI_RESET_REQ", 5000);
  const { loadResult, runResult } = await startConfiguredProgram();
  pushLog(
    `Fairino automatische modus actief; ${normalizeProgramName(loadResult.loadedAfter)} status ${runResult.programStateAfter} na ${runResult.attempts} startpoging(en)`,
  );
  return { resetResult, loadResult, runResult };
});

async function readBits(request, functionCode, address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(functionCode, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  const response = await request(pdu);
  const bits = [];
  for (let index = 0; index < quantity; index += 1) {
    const byte = response[2 + Math.floor(index / 8)];
    bits.push(Boolean(byte & (1 << (index % 8))));
  }
  return bits;
}

async function readRegisters(request, functionCode, address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(functionCode, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  const response = await request(pdu);
  const registers = [];
  for (let index = 0; index < quantity; index += 1) {
    registers.push(response.readUInt16BE(2 + index * 2));
  }
  return registers;
}

async function writeCoil(address, value) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(5, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(value ? 0xff00 : 0x0000, 3);
  await modbusClient.request(pdu);
}

async function writeHoldingRegister(address, value) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(6, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(Math.max(0, Math.min(65535, Number(value) || 0)), 3);
  await modbusClient.request(pdu);
}

function addressOf(items, name) {
  return items.find((item) => item.name === name)?.address;
}

async function pulseModbusCoil(name, durationMs = 500) {
  const address = addressOf(coils, name);
  if (address === undefined) return;
  await writeCoil(address, true);
  setTimeout(() => {
    writeCoil(address, false).catch((error) => pushLog(`Modbus pulse reset fout: ${error.message}`));
  }, durationMs);
}

async function setModbusCoil(name, value) {
  const address = addressOf(coils, name);
  if (address === undefined) return;
  await writeCoil(address, Boolean(value));
}

async function readModbusSnapshot() {
  const coilStart = coils[0].address;
  const holdingStart = holdingRegisters[0].address;
  const discreteStart = discreteInputs[0].address;
  const inputStart = inputRegisters[0].address;
  const { coilBits, holding, discreteBits, input } = await modbusClient.runExclusive(async (request) => ({
    coilBits: await readBits(request, 1, coilStart, coils.length),
    holding: await readRegisters(request, 3, holdingStart, holdingRegisters.length),
    discreteBits: await readBits(request, 2, discreteStart, discreteInputs.length),
    input: await readRegisters(request, 4, inputStart, inputRegisters.length),
  }));

  coils.forEach((item, index) => values.coils[item.name] = coilBits[index]);
  holdingRegisters.forEach((item, index) => values.holdingRegisters[item.name] = holding[index]);
  discreteInputs.forEach((item, index) => values.discreteInputs[item.name] = discreteBits[index]);
  inputRegisters.forEach((item, index) => values.inputRegisters[item.name] = input[index]);
  const heartbeat = Number(values.inputRegisters.CELL_ROBOT_HEARTBEAT || 0);
  if (lastLuaHeartbeat === null) {
    lastLuaHeartbeat = heartbeat;
  } else if (heartbeat !== lastLuaHeartbeat) {
    lastLuaHeartbeat = heartbeat;
    lastLuaHeartbeatChangeAt = Date.now();
  }
}

async function waitForLuaHeartbeat(previousHeartbeat, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  do {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await readModbusSnapshot();
    const heartbeat = Number(values.inputRegisters.CELL_ROBOT_HEARTBEAT || 0);
    if (heartbeat !== previousHeartbeat) return heartbeat;
  } while (Date.now() < deadline);

  throw new FairinoRpcError(
    "Lua-programma is gestart, maar de HMI ontvangt geen nieuwe robot-heartbeat",
    409,
  );
}

async function startConfiguredProgram() {
  await readModbusSnapshot();
  const heartbeatBefore = Number(values.inputRegisters.CELL_ROBOT_HEARTBEAT || 0);
  const loadResult = await fairinoRpc.ensureProgramLoaded(fairinoProgramName);
  if (loadResult.changed) {
    pushLog(
      `Lua-programma geladen: ${normalizeProgramName(loadResult.loadedBefore) || "geen"} -> ${normalizeProgramName(loadResult.loadedAfter)}`,
    );
  }
  await setModbusCoil("HMI_STOP_REQ", false);
  const runResult = await fairinoRpc.enterAutomaticModeAndRun();
  const heartbeatAfter = await waitForLuaHeartbeat(heartbeatBefore);
  return { loadResult, runResult, heartbeatBefore, heartbeatAfter };
}

function currentState() {
  return states[machine.stateIndex];
}

function stateIndexByCode(code) {
  return states.findIndex((state) => state.code === code);
}

function pushLog(message) {
  const time = new Date().toLocaleTimeString("nl-NL", { hour12: false });
  machine.log.unshift(`${time}  ${message}`);
  machine.log = machine.log.slice(0, 80);
}

const cameraSource = new CameraSourceClient(cameraSourceConfigFromEnv());
await cameraSource.refresh();

const videoRecorder = new CycleFaultVideoRecorder(videoRecorderConfigFromEnv(), {
  onEvent: ({ message }) => pushLog(message),
});
try {
  await videoRecorder.initialize();
} catch (error) {
  videoRecorder.setError(`Camera-initialisatie mislukt: ${error.message}`);
}

function pulseCoil(name) {
  values.coils[name] = true;
  setTimeout(() => {
    values.coils[name] = false;
  }, 1200);
}

function allStatusOff() {
  values.discreteInputs.CELL_GLUE_ACTIVE = false;
  values.discreteInputs.CELL_CLAMP_CLOSED = false;
  values.discreteInputs.CELL_GRIPPER_OK = false;
}

function raiseFault(code, message) {
  machine.faultCode = code;
  machine.running = false;
  machine.stateIndex = stateIndexByCode("S900_FAULT");
  values.discreteInputs.CELL_FAULT_ACTIVE = true;
  values.discreteInputs.CELL_RUNNING = false;
  values.discreteInputs.CELL_READY = false;
  pushLog(`FAULT ${code}: ${message}`);
}

function resetMachine() {
  machine.stateIndex = 0;
  machine.faultCode = 0;
  machine.running = false;
  allStatusOff();
  pushLog("Reset naar S00_INIT");
}

function stepMachine() {
  values.discreteInputs.CELL_SAFETY_OK = simInputs.safety_ok;
  values.discreteInputs.CELL_COMMS_OK = true;

  if (!simInputs.safety_ok) {
    machine.faultCode = 990;
    machine.running = false;
    machine.stateIndex = stateIndexByCode("S990_SAFETY_STOP");
    values.discreteInputs.CELL_FAULT_ACTIVE = true;
    values.discreteInputs.CELL_RUNNING = false;
    values.discreteInputs.CELL_READY = false;
    return;
  }

  if (values.coils.HMI_RESET_REQ) {
    values.coils.HMI_STOP_REQ = false;
    values.coils.HMI_ESTOP_REQ = false;
    simInputs.safety_ok = true;
    resetMachine();
    values.coils.HMI_RESET_REQ = false;
  }

  if (values.coils.HMI_STOP_REQ) {
    machine.running = false;
    pushLog("Stop request ontvangen");
  }

  if (values.coils.HMI_ESTOP_REQ) {
    simInputs.safety_ok = false;
    pushLog("Noodstop request ontvangen");
  }

  if (machine.faultCode !== 0) {
    values.discreteInputs.CELL_FAULT_ACTIVE = true;
    values.discreteInputs.CELL_RUNNING = false;
    values.discreteInputs.CELL_READY = false;
    return;
  }

  const batchTarget = Number(values.holdingRegisters.HMI_BATCH_TARGET || 0);
  const batchComplete = batchTarget > 0 && machine.batchDone >= batchTarget;

  values.discreteInputs.CELL_BATCH_COMPLETE = batchComplete;
  if (batchComplete && currentState().code === "S30_WAIT_START") {
    machine.running = false;
  }

  if (values.coils.HMI_START_REQ && !batchComplete) {
    machine.running = true;
    values.coils.HMI_START_REQ = false;
    pushLog("Start request ontvangen");
  }

  const code = currentState().code;
  if (!machine.running && code === "S30_WAIT_START") {
    values.discreteInputs.CELL_READY = true;
    values.discreteInputs.CELL_RUNNING = false;
    return;
  }

  if (!machine.running && code !== "S00_INIT" && code !== "S20_WAIT_READY") {
    values.discreteInputs.CELL_READY = code === "S30_WAIT_START";
    values.discreteInputs.CELL_RUNNING = false;
    return;
  }

  values.discreteInputs.CELL_READY = false;
  values.discreteInputs.CELL_RUNNING = machine.running;

  if (code === "S00_INIT") {
    allStatusOff();
    machine.stateIndex = stateIndexByCode("S20_WAIT_READY");
    pushLog("Init afgerond");
  } else if (code === "S20_WAIT_READY") {
    machine.stateIndex = stateIndexByCode("S30_WAIT_START");
    pushLog("Ready voor start");
  } else if (code === "S30_WAIT_START") {
    if (machine.running) machine.stateIndex = stateIndexByCode("S40_SELECT_FILTER_DISPENSER");
  } else if (code === "S40_SELECT_FILTER_DISPENSER") {
    machine.stateIndex = stateIndexByCode("S50_DISPENSE_FILTER");
    pushLog("Filterdispenser geselecteerd");
  } else if (code === "S50_DISPENSE_FILTER") {
    if (!simInputs.filter_present) return raiseFault(1, "geen filter beschikbaar");
    machine.stateIndex = stateIndexByCode("S60_PICK_FILTER");
    pushLog("Filter ligt klaar");
  } else if (code === "S60_PICK_FILTER") {
    if (!simInputs.gripper_filter_present) return raiseFault(3, "filter niet gepickt");
    values.discreteInputs.CELL_GRIPPER_OK = true;
    machine.stateIndex = stateIndexByCode("S70_PLACE_FILTER_IN_CLAMP");
    pushLog("Filter gepickt");
  } else if (code === "S70_PLACE_FILTER_IN_CLAMP") {
    machine.stateIndex = stateIndexByCode("S80_CLAMP_FILTER");
    pushLog("Filter in clamp geplaatst");
  } else if (code === "S80_CLAMP_FILTER") {
    if (!simInputs.clamp_closed) return raiseFault(6, "klem niet dicht");
    values.discreteInputs.CELL_CLAMP_CLOSED = true;
    machine.stateIndex = stateIndexByCode("S90_DISPENSE_CHECK_VALVE");
    pushLog("Clamp OK");
  } else if (code === "S90_DISPENSE_CHECK_VALVE") {
    machine.stateIndex = stateIndexByCode("S100_PICK_CHECK_VALVE");
    pushLog("Keerklep gedoseerd");
  } else if (code === "S100_PICK_CHECK_VALVE") {
    machine.stateIndex = stateIndexByCode("S110_APPLY_GLUE");
    pushLog("Keerklep gepickt");
  } else if (code === "S110_APPLY_GLUE") {
    values.discreteInputs.CELL_GLUE_ACTIVE = true;
    machine.stateIndex = stateIndexByCode("S120_INSERT_CHECK_VALVE");
    pushLog("Lijm actief, J6 ServoJ rotatie");
  } else if (code === "S120_INSERT_CHECK_VALVE") {
    values.discreteInputs.CELL_GLUE_ACTIVE = false;
    machine.stateIndex = stateIndexByCode("S130_PRESS_CHECK_VALVE");
    pushLog("Keerklep in filter geplaatst");
  } else if (code === "S130_PRESS_CHECK_VALVE") {
    machine.stateIndex = stateIndexByCode("S140_UNCLAMP_FILTER");
    pushLog("Keerklep aangedrukt");
  } else if (code === "S140_UNCLAMP_FILTER") {
    values.discreteInputs.CELL_CLAMP_CLOSED = false;
    machine.stateIndex = stateIndexByCode("S150_PICK_FINISHED_FILTER");
    pushLog("Clamp open");
  } else if (code === "S150_PICK_FINISHED_FILTER") {
    machine.stateIndex = stateIndexByCode("S160_PLACE_IN_DRYING_ROW");
    pushLog("Gereed product gepickt");
  } else if (code === "S160_PLACE_IN_DRYING_ROW") {
    machine.stateIndex = stateIndexByCode("S170_INDEX_DRYING_ROW");
    pushLog("Gereed product in droogrij geplaatst");
  } else if (code === "S170_INDEX_DRYING_ROW") {
    machine.stateIndex = stateIndexByCode("S180_CYCLE_COMPLETE");
    pushLog("Droogrij geindexeerd");
  } else if (code === "S180_CYCLE_COMPLETE") {
    machine.cycleCount += 1;
    machine.batchDone += 1;
    machine.stateIndex = stateIndexByCode("S190_CHECK_NEXT_CYCLE");
    pushLog("Cyclus geteld");
  } else if (code === "S190_CHECK_NEXT_CYCLE") {
    machine.running = false;
    values.discreteInputs.CELL_GLUE_ACTIVE = false;
    machine.stateIndex = stateIndexByCode("S30_WAIT_START");
    pushLog("Cyclus klaar, terug naar ready");
  }
}

function publishRegisters() {
  const state = currentState();
  values.inputRegisters.CELL_STATE = state.value;
  values.inputRegisters.CELL_FAULT_CODE = machine.faultCode;
  values.inputRegisters.CELL_CYCLE_COUNT = machine.cycleCount;
  values.inputRegisters.CELL_BATCH_TARGET_ECHO = Number(values.holdingRegisters.HMI_BATCH_TARGET || 0);
  values.inputRegisters.CELL_BATCH_DONE = machine.batchDone;
  values.inputRegisters.CELL_ROBOT_HEARTBEAT = machine.robotHeartbeat;
  values.discreteInputs.CELL_FAULT_ACTIVE = machine.faultCode !== 0;
}

const heartbeatTimer = setInterval(() => {
  machine.robotHeartbeat = (machine.robotHeartbeat + 1) % 65535;
  if (bridgeMode === "mock") {
    stepMachine();
    publishRegisters();
    return;
  }

  writeHoldingRegister(addressOf(holdingRegisters, "HMI_HEARTBEAT"), machine.robotHeartbeat)
    .catch((error) => pushLog(`Modbus heartbeat fout: ${error.message}`));
}, 700);

async function createSnapshot() {
  let connected = true;
  let controllerRpcConnected = bridgeMode !== "modbus";
  let controllerError = null;
  let controllerProgramState = null;
  let controllerLoadedProgram = null;
  if (bridgeMode === "modbus") {
    const [
      modbusResult,
      controllerErrorResult,
      controllerProgramResult,
      controllerLoadedProgramResult,
    ] = await Promise.allSettled([
      readModbusSnapshot(),
      fairinoRpc.getRobotErrorCode(),
      fairinoRpc.getProgramState(),
      fairinoRpc.getLoadedProgram(),
    ]);
    if (modbusResult.status === "rejected") {
      connected = false;
      pushLog(`Modbus lezen fout: ${modbusResult.reason.message}`);
    }
    if (controllerErrorResult.status === "fulfilled") {
      controllerRpcConnected = true;
      controllerError = controllerErrorResult.value;
    } else {
      pushLog(`Controllerfoutstatus lezen fout: ${controllerErrorResult.reason.message}`);
    }
    if (controllerProgramResult.status === "fulfilled") {
      controllerProgramState = controllerProgramResult.value;
    } else {
      pushLog(`Controllerprogrammastatus lezen fout: ${controllerProgramResult.reason.message}`);
    }
    if (controllerLoadedProgramResult.status === "fulfilled") {
      controllerLoadedProgram = controllerLoadedProgramResult.value;
    } else {
      pushLog(`Geladen Lua-programma lezen fout: ${controllerLoadedProgramResult.reason.message}`);
    }
  } else {
    publishRegisters();
  }

  const controllerProgramMatches = controllerLoadedProgram === null
    ? null
    : normalizeProgramName(controllerLoadedProgram) === normalizeProgramName(fairinoProgramName);
  const luaHeartbeatFresh = bridgeMode === "mock"
    ? null
    : lastLuaHeartbeatChangeAt > 0 && Date.now() - lastLuaHeartbeatChangeAt < 5000;

  const effectiveStatus = overlayControllerFault({
    discreteInputs: discreteInputs.map((item) => ({ ...item, value: values.discreteInputs[item.name] })),
    inputRegisters: inputRegisters.map((item) => ({ ...item, value: values.inputRegisters[item.name] })),
  }, controllerError, {
    hmiEstopActive: values.coils.HMI_ESTOP_REQ,
    controllerProgramState,
    controllerProgramMatches,
    luaHeartbeatFresh,
  });
  const stateValue = values.inputRegisters.CELL_STATE;
  const state = states.find((item) => item.value === stateValue) || currentState();
  machine.faultCode = effectiveStatus.faultCode;
  machine.cycleCount = Number(values.inputRegisters.CELL_CYCLE_COUNT || 0);
  machine.batchDone = Number(values.inputRegisters.CELL_BATCH_DONE || 0);
  const effectiveFaultActive = effectiveStatus.discreteInputs
    .find((item) => item.name === "CELL_FAULT_ACTIVE")?.value;
  videoRecorder.observe({
    productionActive: effectiveStatus.discreteInputs
      .find((item) => item.name === "CELL_RUNNING")?.value,
    faultActive: effectiveFaultActive,
    faultCode: effectiveStatus.faultCode,
    faultMessage: controllerFaultMessage(controllerError)
      || (effectiveFaultActive ? `${state.code}: ${state.label}` : null),
  }).catch((error) => pushLog(`Videorecorder fout: ${error.message}`));

  return {
    mode: bridgeMode,
    connected,
    endpoint: bridgeMode === "modbus" ? `${fairinoHost}:${fairinoPort}` : "local mock",
    controller: {
      rpcConnected: controllerRpcConnected,
      error: controllerError,
      faultMessage: controllerFaultMessage(controllerError),
      programState: controllerProgramState,
      expectedProgram: fairinoProgramName,
      loadedProgram: controllerLoadedProgram,
      programMatches: controllerProgramMatches,
      luaHeartbeatFresh,
    },
    capabilities: {
      cellEnable: {
        enabled: bridgeMode === "modbus",
        expectedProgram: fairinoProgramName,
      },
      outputTests: {
        enabled: outputTestsEnabled,
        activeLow: true,
        coils: outputTestCoils,
      },
    },
    states,
    coils: coils.map((item) => ({ ...item, value: values.coils[item.name] })),
    holdingRegisters: holdingRegisters.map((item) => ({ ...item, value: values.holdingRegisters[item.name] })),
    discreteInputs: effectiveStatus.discreteInputs,
    inputRegisters: effectiveStatus.inputRegisters,
    simInputs,
    machine: {
      state,
      faultCode: machine.faultCode,
      cycleCount: machine.cycleCount,
      batchDone: machine.batchDone,
      running: machine.running,
      log: machine.log,
    },
    camera: {
      ...videoRecorder.status(),
      source: cameraSource.status(),
    },
  };
}

const snapshot = createSingleFlight(createSnapshot);
const recorderMonitor = setInterval(() => {
  snapshot().catch((error) => pushLog(`Camerastatuscontrole fout: ${error.message}`));
}, 700);
const cameraSourceMonitor = setInterval(() => {
  cameraSource.refresh().catch((error) => pushLog(`Camerabroncontrole fout: ${error.message}`));
}, 2000);

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/video/live") {
    cameraSource.proxyLive(req, res);
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/video/incidents") {
    sendJson(res, 200, {
      incidents: videoRecorder.listIncidents(),
      retentionDays: videoRecorder.config.retentionDays,
      maxIncidents: videoRecorder.config.maxIncidents,
    });
    return true;
  }

  const thumbnailMatch = /^\/api\/video\/incidents\/([A-Za-z0-9-]+)\/thumbnail$/.exec(url.pathname);
  if ((req.method === "GET" || req.method === "HEAD") && thumbnailMatch) {
    const incident = videoRecorder.getIncident(thumbnailMatch[1]);
    if (!incident || !incident.thumbnailAvailable) {
      sendJson(res, 404, { error: "Geen thumbnail beschikbaar" });
      return true;
    }
    await serveThumbnail(req, res, incident.thumbnailPath);
    return true;
  }

  const incidentMatch = /^\/api\/video\/incidents\/([A-Za-z0-9-]+)$/.exec(url.pathname);
  if ((req.method === "GET" || req.method === "HEAD") && incidentMatch) {
    const incident = videoRecorder.getIncident(incidentMatch[1]);
    if (!incident) {
      sendJson(res, 404, { error: "Storingvideo niet gevonden" });
      return true;
    }
    await serveVideoFile(req, res, incident.clipPath);
    return true;
  }

  if ((req.method === "GET" || req.method === "HEAD") && url.pathname === "/api/video/fault") {
    const latest = videoRecorder.latestIncident();
    if (!latest) {
      sendJson(res, 404, { error: "Geen storingvideo beschikbaar" });
      return true;
    }
    await serveVideoFile(req, res, latest.clipPath);
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/registers") {
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/command") {
    const body = await readJson(req);
    if (bridgeMode === "modbus") {
      if (body.command === "enable") {
        try {
          await enableCell();
        } catch (error) {
          pushLog(`Cel inschakelen mislukt: ${error.message}`);
          throw error;
        }
      }
      if (body.command === "start") {
        await readModbusSnapshot();
        const [programState, loadedProgram] = await Promise.all([
          fairinoRpc.getProgramState(),
          fairinoRpc.getLoadedProgram(),
        ]);
        if (programState !== 2) {
          throw new FairinoRpcError(
            "Productiestart geweigerd: schakel de cel eerst in",
            409,
          );
        }
        if (normalizeProgramName(loadedProgram) !== normalizeProgramName(fairinoProgramName)) {
          throw new FairinoRpcError(
            `Productiestart geweigerd: onverwacht Lua-programma actief (${loadedProgram})`,
            409,
          );
        }
        const heartbeatBefore = Number(values.inputRegisters.CELL_ROBOT_HEARTBEAT || 0);
        await waitForLuaHeartbeat(heartbeatBefore, 3000);
        await setModbusCoil("HMI_STOP_REQ", false);
        await pulseModbusCoil("HMI_START_REQ", 5000);
      }
      if (body.command === "stop") await setModbusCoil("HMI_STOP_REQ", true);
      if (body.command === "estop") {
        await setModbusCoil("HMI_ESTOP_REQ", true);
        try {
          const stopResult = await fairinoRpc.programStopAndVerify();
          pushLog(
            `Fairino Lua-programma gestopt: status ${stopResult.programStateBefore} -> ${stopResult.programStateAfter}`,
          );
        } catch (error) {
          pushLog(`Fairino program stop fout: ${error.message}`);
        }
      }
      if (body.command === "reset") {
        try {
          await recoverRobotAndRun();
        } catch (error) {
          pushLog(`Fairino herstel mislukt: ${error.message}`);
          throw error;
        }
      }
      if (body.command === "ack") await pulseModbusCoil("HMI_ACK_REQ", 2000);
      sendJson(res, 200, await snapshot());
      return true;
    }

    if (body.command === "start") {
      values.coils.HMI_STOP_REQ = false;
      pulseCoil("HMI_START_REQ");
    }
    if (body.command === "stop") values.coils.HMI_STOP_REQ = true;
    if (body.command === "estop") {
      values.coils.HMI_ESTOP_REQ = true;
      simInputs.safety_ok = false;
    }
    if (body.command === "reset") {
      values.coils.HMI_STOP_REQ = false;
      values.coils.HMI_ESTOP_REQ = false;
      simInputs.safety_ok = true;
      pulseCoil("HMI_RESET_REQ");
      resetMachine();
    }
    if (body.command === "ack") pulseCoil("HMI_ACK_REQ");
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/holding") {
    const body = await readJson(req);
    if (bridgeMode === "modbus") {
      const address = addressOf(holdingRegisters, body.name);
      if (address !== undefined) await writeHoldingRegister(address, body.value);
      sendJson(res, 200, await snapshot());
      return true;
    }

    if (Object.hasOwn(values.holdingRegisters, body.name)) {
      values.holdingRegisters[body.name] = Number(body.value || 0);
    }
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/coil") {
    const body = await readJson(req);
    if (bridgeMode === "modbus") {
      const address = addressOf(coils, body.name);
      if (address !== undefined) await writeCoil(address, Boolean(body.value));
      sendJson(res, 200, await snapshot());
      return true;
    }

    if (Object.hasOwn(values.coils, body.name)) {
      values.coils[body.name] = Boolean(body.value);
    }
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/modbus/coil") {
    const body = await readJson(req);
    const command = parseOutputTestRequest(body, { enabled: outputTestsEnabled });

    if (bridgeMode === "modbus") {
      try {
        await readModbusSnapshot();
      } catch (error) {
        throw new OutputTestRequestError(502, `IO-test statuscontrole mislukt: ${error.message}`);
      }
      assertOutputTestInterlock({ running: values.discreteInputs.CELL_RUNNING });
      await writeCoil(command.address, command.value);
      if (command.pulseMs > 0) {
        setTimeout(() => {
          writeCoil(command.address, command.resetValue)
            .catch((error) => pushLog(`DO pulse reset fout: ${error.message}`));
        }, command.pulseMs);
      }
      pushLog(`IO-test coil ${command.address} = ${command.value ? 1 : 0}`);
      sendJson(res, 200, await snapshot());
      return true;
    }

    assertOutputTestInterlock({ running: values.discreteInputs.CELL_RUNNING });
    pushLog(`Mock IO-test coil ${command.address} = ${command.value ? 1 : 0}`);
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/sim-input") {
    const body = await readJson(req);
    if (Object.hasOwn(simInputs, body.name)) {
      simInputs[body.name] = Boolean(body.value);
    }
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/sim/reset-counters") {
    machine.cycleCount = 0;
    machine.batchDone = 0;
    pushLog("Tellers gereset");
    sendJson(res, 200, await snapshot());
    return true;
  }

  return false;
}

const hmiServer = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${bindHost}:${port}`);

  try {
    if (url.pathname.startsWith("/api/") && await handleApi(req, res, url)) {
      return;
    }
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message });
    return;
  }

  const rel = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const file = normalize(join(root, rel));

  if (!file.startsWith(normalize(root))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(file);
    res.writeHead(200, {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Pragma": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

hmiServer.listen(port, bindHost, () => {
  console.log(`HMI simulator bridge: http://${bindHost}:${port}/`);
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(heartbeatTimer);
  clearInterval(recorderMonitor);
  clearInterval(cameraSourceMonitor);
  console.log(`HMI afsluiten na ${signal}`);
  await videoRecorder.shutdown().catch((error) => console.error(error));
  hmiServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 7000).unref();
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
