import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import net from "node:net";

const root = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const port = Number(process.env.PORT || 8787);
const bridgeMode = process.env.HMI_BRIDGE_MODE || "mock";
const fairinoHost = process.env.FAIRINO_HOST || "192.168.92.128";
const fairinoPort = Number(process.env.FAIRINO_PORT || 502);
const unitId = Number(process.env.FAIRINO_UNIT_ID || 1);
const fairinoHttpBase = process.env.FAIRINO_HTTP_BASE || `http://${fairinoHost}`;

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

let modbusTransactionId = 1;

function modbusRequest(pdu) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: fairinoHost, port: fairinoPort, timeout: 2000 });
    const transactionId = modbusTransactionId++ % 65535;
    const mbap = Buffer.alloc(7);
    mbap.writeUInt16BE(transactionId, 0);
    mbap.writeUInt16BE(0, 2);
    mbap.writeUInt16BE(pdu.length + 1, 4);
    mbap.writeUInt8(unitId, 6);

    socket.on("connect", () => socket.write(Buffer.concat([mbap, pdu])));
    socket.on("data", (data) => {
      socket.end();
      if (data[7] >= 0x80) {
        reject(new Error(`Modbus exception ${data[8]}`));
        return;
      }
      resolve(data.subarray(7));
    });
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Modbus timeout"));
    });
    socket.on("error", reject);
  });
}

async function readBits(functionCode, address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(functionCode, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  const response = await modbusRequest(pdu);
  const bits = [];
  for (let index = 0; index < quantity; index += 1) {
    const byte = response[2 + Math.floor(index / 8)];
    bits.push(Boolean(byte & (1 << (index % 8))));
  }
  return bits;
}

async function readRegisters(functionCode, address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(functionCode, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  const response = await modbusRequest(pdu);
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
  await modbusRequest(pdu);
}

async function writeHoldingRegister(address, value) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(6, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(Math.max(0, Math.min(65535, Number(value) || 0)), 3);
  await modbusRequest(pdu);
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

async function sendFairinoProgramStop() {
  const response = await fetch(`${fairinoHttpBase}/action/set`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmd: 102, data: {} }),
  });
  const text = await response.text();
  if (!response.ok || text.trim() !== "success") {
    throw new Error(`Fairino program stop rejected: ${response.status} ${text}`);
  }
}

async function readModbusSnapshot() {
  const coilStart = coils[0].address;
  const holdingStart = holdingRegisters[0].address;
  const discreteStart = discreteInputs[0].address;
  const inputStart = inputRegisters[0].address;
  const [coilBits, holding, discreteBits, input] = await Promise.all([
    readBits(1, coilStart, coils.length),
    readRegisters(3, holdingStart, holdingRegisters.length),
    readBits(2, discreteStart, discreteInputs.length),
    readRegisters(4, inputStart, inputRegisters.length),
  ]);

  coils.forEach((item, index) => values.coils[item.name] = coilBits[index]);
  holdingRegisters.forEach((item, index) => values.holdingRegisters[item.name] = holding[index]);
  discreteInputs.forEach((item, index) => values.discreteInputs[item.name] = discreteBits[index]);
  inputRegisters.forEach((item, index) => values.inputRegisters[item.name] = input[index]);
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

setInterval(() => {
  machine.robotHeartbeat = (machine.robotHeartbeat + 1) % 65535;
  if (bridgeMode === "mock") {
    stepMachine();
    publishRegisters();
    return;
  }

  writeHoldingRegister(addressOf(holdingRegisters, "HMI_HEARTBEAT"), machine.robotHeartbeat)
    .catch((error) => pushLog(`Modbus heartbeat fout: ${error.message}`));
}, 700);

async function snapshot() {
  let connected = true;
  if (bridgeMode === "modbus") {
    try {
      await readModbusSnapshot();
    } catch (error) {
      connected = false;
      pushLog(`Modbus lezen fout: ${error.message}`);
    }
  } else {
    publishRegisters();
  }

  const stateValue = values.inputRegisters.CELL_STATE;
  const state = states.find((item) => item.value === stateValue) || currentState();
  machine.faultCode = Number(values.inputRegisters.CELL_FAULT_CODE || 0);
  machine.cycleCount = Number(values.inputRegisters.CELL_CYCLE_COUNT || 0);
  machine.batchDone = Number(values.inputRegisters.CELL_BATCH_DONE || 0);

  return {
    mode: bridgeMode,
    connected,
    endpoint: bridgeMode === "modbus" ? `${fairinoHost}:${fairinoPort}` : "local mock",
    states,
    coils: coils.map((item) => ({ ...item, value: values.coils[item.name] })),
    holdingRegisters: holdingRegisters.map((item) => ({ ...item, value: values.holdingRegisters[item.name] })),
    discreteInputs: discreteInputs.map((item) => ({ ...item, value: values.discreteInputs[item.name] })),
    inputRegisters: inputRegisters.map((item) => ({ ...item, value: values.inputRegisters[item.name] })),
    simInputs,
    machine: {
      state,
      faultCode: machine.faultCode,
      cycleCount: machine.cycleCount,
      batchDone: machine.batchDone,
      running: machine.running,
      log: machine.log,
    },
  };
}

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
  if (req.method === "GET" && url.pathname === "/api/registers") {
    sendJson(res, 200, await snapshot());
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/command") {
    const body = await readJson(req);
    if (bridgeMode === "modbus") {
      if (body.command === "start") {
        await setModbusCoil("HMI_STOP_REQ", false);
        await pulseModbusCoil("HMI_START_REQ", 5000);
      }
      if (body.command === "stop") await setModbusCoil("HMI_STOP_REQ", true);
      if (body.command === "estop") {
        await setModbusCoil("HMI_ESTOP_REQ", true);
        try {
          await sendFairinoProgramStop();
        } catch (error) {
          pushLog(`Fairino program stop fout: ${error.message}`);
        }
      }
      if (body.command === "reset") {
        await setModbusCoil("HMI_STOP_REQ", false);
        await setModbusCoil("HMI_ESTOP_REQ", false);
        await pulseModbusCoil("HMI_RESET_REQ", 5000);
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

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);

  try {
    if (url.pathname.startsWith("/api/") && await handleApi(req, res, url)) {
      return;
    }
  } catch (error) {
    sendJson(res, 500, { error: error.message });
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
    res.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`HMI simulator bridge: http://127.0.0.1:${port}/`);
});
