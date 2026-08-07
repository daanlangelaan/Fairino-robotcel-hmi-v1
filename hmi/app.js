const stateByValue = new Map();
let snapshot = null;
let activeTab = "user";
let batchTargetEditing = false;
let lastRobotHeartbeat = null;
let lastRobotHeartbeatAt = 0;
let operatorNotice = null;

const els = {
  runState: document.querySelector("#runState"),
  activeState: document.querySelector("#activeState"),
  cycleCount: document.querySelector("#cycleCount"),
  bridgeState: document.querySelector("#bridgeState"),
  modbusState: document.querySelector("#modbusState"),
  modbusLamp: document.querySelector("#modbusLamp"),
  robotCommsState: document.querySelector("#robotCommsState"),
  robotCommsLamp: document.querySelector("#robotCommsLamp"),
  operatorTitle: document.querySelector("#operatorTitle"),
  operatorMessage: document.querySelector("#operatorMessage"),
  faultBanner: document.querySelector("#faultBanner"),
  batchTarget: document.querySelector("#batchTarget"),
  batchTargetView: document.querySelector("#batchTargetView"),
  batchDone: document.querySelector("#batchDone"),
  lampRed: document.querySelector("#lampRed"),
  lampAmber: document.querySelector("#lampAmber"),
  lampGreen: document.querySelector("#lampGreen"),
  simInputs: document.querySelector("#simInputs"),
  commandRegisters: document.querySelector("#commandRegisters"),
  statusRegisters: document.querySelector("#statusRegisters"),
  states: document.querySelector("#states"),
  log: document.querySelector("#log"),
  heartbeatView: document.querySelector("#heartbeatView"),
  stateValueView: document.querySelector("#stateValueView"),
  exitHmiDialog: document.querySelector("#exitHmiDialog"),
  exitHmiStatus: document.querySelector("#exitHmiStatus"),
  ioOutputTests: document.querySelector("#ioOutputTests"),
  ioTestEnable: document.querySelector("#ioTestEnable"),
  ioTestStatus: document.querySelector("#ioTestStatus"),
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || `${response.status} ${response.statusText}`);
  return body;
}

async function post(path, body) {
  snapshot = await api(path, {
    method: "POST",
    body: JSON.stringify(body || {}),
  });
  render();
}

function command(name) {
  return post("/api/command", { command: name });
}

function getDiscrete(name) {
  return Boolean(snapshot?.discreteInputs?.find((item) => item.name === name)?.value);
}

function getInputRegister(name) {
  return Number(snapshot?.inputRegisters?.find((item) => item.name === name)?.value || 0);
}

function getHoldingRegister(name) {
  return Number(snapshot?.holdingRegisters?.find((item) => item.name === name)?.value || 0);
}

function getState() {
  const value = getInputRegister("CELL_STATE");
  return stateByValue.get(value) || snapshot?.machine?.state || { code: "UNKNOWN", value, label: "Onbekend" };
}

function statusText() {
  if (operatorNotice && Date.now() < operatorNotice.expiresAt) {
    return [operatorNotice.title, operatorNotice.message];
  }
  if (!snapshot?.connected) return ["Offline", "Geen verbinding met bridge"];
  if (getDiscrete("CELL_FAULT_ACTIVE")) return ["Storing", `Foutcode ${getInputRegister("CELL_FAULT_CODE")}`];
  if (getDiscrete("CELL_BATCH_COMPLETE")) return ["Batch klaar", "Batchdoel bereikt"];
  if (getDiscrete("CELL_RUNNING")) return ["Draait", getState().label];
  if (getDiscrete("CELL_READY")) return ["Ready", "Wachten op start"];
  return ["Initialiseren", getState().label];
}

function renderStatus() {
  const [title, message] = statusText();
  const fault = getDiscrete("CELL_FAULT_ACTIVE");
  const running = getDiscrete("CELL_RUNNING");
  const ready = getDiscrete("CELL_READY");
  const state = getState();
  const cycleCount = getInputRegister("CELL_CYCLE_COUNT");
  const faultCode = getInputRegister("CELL_FAULT_CODE");

  els.runState.className = "status-pill";
  if (fault) els.runState.classList.add("status-fault");
  else if (running) els.runState.classList.add("status-running");
  else els.runState.classList.add("status-idle");

  els.runState.textContent = title;
  els.activeState.textContent = state.code;
  els.cycleCount.textContent = `Cycles ${cycleCount}`;
  els.bridgeState.textContent = snapshot?.mode === "mock"
    ? "Bridge mock"
    : `Bridge Modbus ${snapshot.connected ? "online" : "offline"}`;
  els.operatorTitle.textContent = title;
  els.operatorMessage.textContent = message;
  els.batchDone.textContent = String(getInputRegister("CELL_BATCH_DONE") || getInputRegister("CELL_CYCLE_COUNT"));
  els.batchTargetView.textContent = String(getHoldingRegister("HMI_BATCH_TARGET"));
  if (!batchTargetEditing && document.activeElement !== els.batchTarget) {
    els.batchTarget.value = String(getHoldingRegister("HMI_BATCH_TARGET"));
  }
  const hmiHeartbeat = getHoldingRegister("HMI_HEARTBEAT");
  const robotHeartbeat = getInputRegister("CELL_ROBOT_HEARTBEAT");
  const robotPulse = getDiscrete("CELL_COMMS_OK") ? 1 : 0;
  if (robotHeartbeat !== lastRobotHeartbeat) {
    lastRobotHeartbeat = robotHeartbeat;
    lastRobotHeartbeatAt = Date.now();
  }
  const robotHeartbeatFresh = robotHeartbeat > 0 && Date.now() - lastRobotHeartbeatAt < 10000;
  const robotOnline = snapshot?.connected && (robotHeartbeatFresh || getDiscrete("CELL_READY") || getDiscrete("CELL_RUNNING"));

  els.modbusLamp.classList.toggle("on", Boolean(snapshot?.connected));
  els.modbusState.title = snapshot?.connected ? "Modbus TCP bridge heeft verbinding" : "Geen Modbus TCP verbinding";
  els.robotCommsLamp.classList.toggle("on", robotOnline);
  els.robotCommsLamp.classList.toggle("warn", snapshot?.connected && !robotOnline);
  els.robotCommsState.title = robotOnline
    ? "Lua status/heartbeat komt binnen"
    : "Modbus TCP is online, maar de Lua status-loop draait niet of schrijft nog niet";
  els.heartbeatView.textContent = `HMI HB ${hmiHeartbeat} / Robot pulse ${robotPulse} / Robot HB ${robotHeartbeat}`;
  els.stateValueView.textContent = `STATE ${state.value}`;

  els.faultBanner.classList.toggle("hidden", !fault);
  els.faultBanner.textContent = fault ? `Fout ${faultCode}` : "Geen storing";

  els.lampRed.classList.toggle("on", fault);
  els.lampAmber.classList.toggle("on", ready && !fault);
  els.lampGreen.classList.toggle("on", running && !fault);
}

function renderStations() {
  const state = getState();
  document.querySelectorAll(".station").forEach((station) => {
    station.classList.toggle("active", station.dataset.state === state.code);
    station.classList.remove("done");
  });
}

function renderStates() {
  const current = getState();
  els.states.innerHTML = "";
  snapshot.states.forEach((item) => {
    const row = document.createElement("div");
    row.className = `state-item ${item.code === current.code ? "active" : ""}`;
    row.innerHTML = `<span>${item.code}</span><span>${item.label}</span><strong>${item.value}</strong>`;
    els.states.append(row);
  });
}

function renderSimInputs() {
  const labels = {
    safety_ok: "Safety OK",
    filter_present: "Filter aanwezig",
    gripper_filter_present: "Grijper OK",
    clamp_closed: "Klem dicht",
  };
  els.simInputs.innerHTML = "";
  Object.entries(snapshot.simInputs).forEach(([name, value]) => {
    const row = document.createElement("div");
    row.className = "input-row";
    row.innerHTML = `
      <label>
        <input type="checkbox" ${value ? "checked" : ""} data-sim-input="${name}">
        ${labels[name] || name}
      </label>
      <span>${name}</span>
    `;
    els.simInputs.append(row);
  });
}

function registerRow(item, kind) {
  const row = document.createElement("div");
  row.className = "register-row";
  const valueText = typeof item.value === "boolean" ? (item.value ? "1" : "0") : String(item.value);
  row.innerHTML = `
    <span class="reg-address">${item.address}</span>
    <span class="reg-name">${item.name}</span>
    <span class="reg-label">${item.label}</span>
    <strong class="${item.value ? "reg-on" : ""}">${valueText}</strong>
  `;
  row.dataset.kind = kind;
  row.dataset.name = item.name;
  return row;
}

function renderRegisters() {
  els.commandRegisters.innerHTML = "";
  snapshot.coils.forEach((item) => els.commandRegisters.append(registerRow(item, "coil")));
  snapshot.holdingRegisters.forEach((item) => els.commandRegisters.append(registerRow(item, "holding")));

  els.statusRegisters.innerHTML = "";
  snapshot.discreteInputs.forEach((item) => els.statusRegisters.append(registerRow(item, "discrete")));
  snapshot.inputRegisters.forEach((item) => els.statusRegisters.append(registerRow(item, "input")));
}

function renderAdvanced() {
  const configured = Boolean(snapshot?.capabilities?.outputTests?.enabled);
  const running = getDiscrete("CELL_RUNNING");
  if (!configured || running) els.ioTestEnable.checked = false;
  els.ioTestEnable.disabled = !configured || running;

  const armed = configured && !running && els.ioTestEnable.checked;
  els.ioOutputTests.querySelectorAll("button").forEach((button) => {
    button.disabled = !armed;
  });

  if (!configured) {
    els.ioTestStatus.textContent = "Uitgeschakeld in serviceconfiguratie";
  } else if (running) {
    els.ioTestStatus.textContent = "Geblokkeerd: robotcyclus draait";
  } else if (armed) {
    els.ioTestStatus.textContent = "Vrijgegeven voor handmatige IO-test";
  } else {
    els.ioTestStatus.textContent = "Vergrendeld";
  }
}

function renderLog() {
  els.log.innerHTML = "";
  snapshot.machine.log.forEach((line) => {
    const row = document.createElement("div");
    row.textContent = line;
    els.log.append(row);
  });
}

function render() {
  if (!snapshot) return;
  snapshot.states.forEach((item) => stateByValue.set(item.value, item));
  renderStatus();
  renderStations();
  renderStates();
  renderSimInputs();
  renderRegisters();
  renderAdvanced();
  renderLog();
}

async function refresh() {
  try {
    snapshot = await api("/api/registers");
    render();
  } catch {
    els.runState.className = "status-pill status-fault";
    els.runState.textContent = "Offline";
    els.bridgeState.textContent = "Bridge offline";
  }
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.tab;
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    document.querySelectorAll(".tab-page").forEach((page) => {
      page.classList.toggle("active", page.id === `${activeTab}Tab`);
    });
    if (activeTab !== "advanced") {
      els.ioTestEnable.checked = false;
      renderAdvanced();
    }
  });
});

document.querySelector("#startBtn").addEventListener("click", () => command("start"));
document.querySelector("#stopBtn").addEventListener("click", () => command("stop"));
document.querySelector("#estopBtn").addEventListener("click", () => command("estop"));
document.querySelector("#ackBtn").addEventListener("click", () => command("ack"));

document.querySelector("#resetBtn").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "Resetten...";
  operatorNotice = {
    title: "Robot resetten",
    message: "Controllerfout wordt gewist en gecontroleerd",
    expiresAt: Date.now() + 10000,
  };
  renderStatus();

  try {
    await command("reset");
    operatorNotice = {
      title: "Reset voltooid",
      message: "Robotfout gewist; robotprogramma blijft gestopt",
      expiresAt: Date.now() + 5000,
    };
  } catch (error) {
    operatorNotice = {
      title: "Reset mislukt",
      message: error.message,
      expiresAt: Date.now() + 10000,
    };
  } finally {
    button.disabled = false;
    button.textContent = "Reset";
    renderStatus();
  }
});

document.querySelector("#exitHmiBtn").addEventListener("click", () => {
  els.exitHmiStatus.classList.add("hidden");
  els.exitHmiDialog.showModal();
});

document.querySelector("#confirmExitHmiBtn").addEventListener("click", (event) => {
  event.preventDefault();
  window.close();

  // Chromium app windows normally close immediately. If the browser blocks
  // window.close(), keep the confirmation open and show the safe fallback.
  window.setTimeout(() => {
    els.exitHmiStatus.classList.remove("hidden");
  }, 500);
});

document.querySelector("#setBatchBtn").addEventListener("click", () => {
  batchTargetEditing = false;
  els.batchTarget.blur();
  post("/api/holding", {
    name: "HMI_BATCH_TARGET",
    value: Number(els.batchTarget.value || 1),
  });
});

els.batchTarget.addEventListener("focus", () => {
  batchTargetEditing = true;
});

els.batchTarget.addEventListener("blur", () => {
  batchTargetEditing = false;
});

els.batchTarget.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.querySelector("#setBatchBtn").click();
  }
});

document.querySelector("#resetCountersBtn").addEventListener("click", () => {
  post("/api/sim/reset-counters", {});
});

document.querySelector("#goodInputsBtn").addEventListener("click", async () => {
  for (const name of Object.keys(snapshot.simInputs)) {
    await post("/api/sim-input", { name, value: true });
  }
});

els.simInputs.addEventListener("change", (event) => {
  const name = event.target.dataset.simInput;
  if (!name) return;
  post("/api/sim-input", { name, value: event.target.checked });
});

els.commandRegisters.addEventListener("click", (event) => {
  const row = event.target.closest(".register-row");
  if (!row || row.dataset.kind !== "coil") return;
  post("/api/coil", { name: row.dataset.name, value: true });
});

els.ioOutputTests.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-output-action]");
  const row = event.target.closest(".output-test-row");
  if (!button || !row || !els.ioTestEnable.checked || getDiscrete("CELL_RUNNING")) return;

  const action = button.dataset.outputAction;
  const body = {
    address: Number(row.dataset.address),
    confirmed: true,
    value: action === "off",
  };
  if (action === "pulse") {
    body.value = false;
    body.pulseMs = 500;
    body.resetValue = true;
  }

  try {
    await post("/api/modbus/coil", body);
    els.ioTestStatus.textContent = `Coil ${body.address}: ${action}`;
  } catch (error) {
    els.ioTestEnable.checked = false;
    renderAdvanced();
    els.ioTestStatus.textContent = error.message;
  }
});

els.ioTestEnable.addEventListener("change", renderAdvanced);

setInterval(refresh, 700);
refresh();
