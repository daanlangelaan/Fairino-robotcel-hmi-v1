import { StationTimingModel } from "./station-timing.mjs";
import {
  BATCH_MAX,
  BATCH_MIN,
  batchRowHeightFromElement,
  batchValueFromScroll,
  normalizeBatchTarget,
} from "./batch-selector.mjs";

const stateByValue = new Map();
let snapshot = null;
const requestedTab = new URLSearchParams(window.location.search).get("tab");
let activeTab = ["user", "troubleshoot", "camera", "advanced"].includes(requestedTab)
  ? requestedTab
  : "user";
let batchTargetEditing = false;
let batchWheelValue = 10;
let batchWheelRowHeight = 48;
let batchWheelSuppressClickUntil = 0;
let batchWheelPointer = null;
let keypadDigits = "10";
let keypadReplaceOnNextDigit = true;
let operatorNotice = null;
let robotActionPending = null;
let loadedIncidentId = null;
let incidentLibrary = [];
let incidentLibrarySignature = "";
let incidentRefreshPending = null;
let liveCameraActive = null;
let lastFaultActive = null;
let faultPrompt = null;
const stationTiming = new StationTimingModel({ storage: window.localStorage });

const els = {
  runState: document.querySelector("#runState"),
  activeState: document.querySelector("#activeState"),
  cycleCount: document.querySelector("#cycleCount"),
  bridgeState: document.querySelector("#bridgeState"),
  bridgeLamp: document.querySelector("#bridgeLamp"),
  remoteIoState: document.querySelector("#remoteIoState"),
  remoteIoLamp: document.querySelector("#remoteIoLamp"),
  modbusState: document.querySelector("#modbusState"),
  modbusLamp: document.querySelector("#modbusLamp"),
  robotCommsState: document.querySelector("#robotCommsState"),
  robotCommsLamp: document.querySelector("#robotCommsLamp"),
  operatorTitle: document.querySelector("#operatorTitle"),
  operatorMessage: document.querySelector("#operatorMessage"),
  faultBanner: document.querySelector("#faultBanner"),
  enableCellBtn: document.querySelector("#enableCellBtn"),
  startBtn: document.querySelector("#startBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  startupNotice: document.querySelector("#startupNotice"),
  stopNotice: document.querySelector("#stopNotice"),
  batchWheel: document.querySelector("#batchWheel"),
  batchTargetView: document.querySelector("#batchTargetView"),
  batchDone: document.querySelector("#batchDone"),
  batchKeypadDialog: document.querySelector("#batchKeypadDialog"),
  batchKeypadDisplay: document.querySelector("#batchKeypadDisplay"),
  batchKeypadStatus: document.querySelector("#batchKeypadStatus"),
  batchKeypad: document.querySelector("#batchKeypad"),
  acceptBatchKeypadBtn: document.querySelector("#acceptBatchKeypadBtn"),
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
  cameraState: document.querySelector("#cameraState"),
  cameraLamp: document.querySelector("#cameraLamp"),
  userLiveCameraPlaceholder: document.querySelector("#userLiveCameraPlaceholder"),
  userLiveCamera: document.querySelector("#userLiveCamera"),
  userLiveCameraResolution: document.querySelector("#userLiveCameraResolution"),
  userLiveCameraRecording: document.querySelector("#userLiveCameraRecording"),
  incidentRetention: document.querySelector("#incidentRetention"),
  incidentCount: document.querySelector("#incidentCount"),
  incidentList: document.querySelector("#incidentList"),
  incidentPlayerPlaceholder: document.querySelector("#incidentPlayerPlaceholder"),
  faultVideo: document.querySelector("#faultVideo"),
  selectedIncidentTitle: document.querySelector("#selectedIncidentTitle"),
  selectedIncidentMessage: document.querySelector("#selectedIncidentMessage"),
  selectedIncidentDetails: document.querySelector("#selectedIncidentDetails"),
  reloadIncidentVideoBtn: document.querySelector("#reloadIncidentVideoBtn"),
  faultVideoDialog: document.querySelector("#faultVideoDialog"),
  closeFaultVideoDialogBtn: document.querySelector("#closeFaultVideoDialogBtn"),
  faultVideoDialogTitle: document.querySelector("#faultVideoDialogTitle"),
  faultVideoDialogMessage: document.querySelector("#faultVideoDialogMessage"),
  faultVideoDialogStatus: document.querySelector("#faultVideoDialogStatus"),
  openFaultVideoBtn: document.querySelector("#openFaultVideoBtn"),
  faultVideoDialogPlayer: document.querySelector("#faultVideoDialogPlayer"),
  faultPopupVideo: document.querySelector("#faultPopupVideo"),
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

function getCoil(name) {
  return Boolean(snapshot?.coils?.find((item) => item.name === name)?.value);
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

function updateBatchWheelAppearance() {
  els.batchWheel.querySelectorAll(".batch-wheel-option").forEach((option) => {
    const value = Number(option.dataset.value);
    option.classList.toggle("selected", value === batchWheelValue);
    option.classList.toggle("near-before", value === batchWheelValue - 1);
    option.classList.toggle("near-after", value === batchWheelValue + 1);
    option.setAttribute("aria-selected", String(value === batchWheelValue));
  });
  els.batchWheel.setAttribute("aria-activedescendant", `batchOption${batchWheelValue}`);
}

function setBatchWheelValue(value, { behavior = "smooth", scroll = true } = {}) {
  batchWheelValue = normalizeBatchTarget(value, batchWheelValue);
  updateBatchWheelAppearance();
  if (scroll) {
    els.batchWheel.scrollTo({
      top: (batchWheelValue - BATCH_MIN) * batchWheelRowHeight,
      behavior,
    });
  }
}

function initializeBatchWheel() {
  const fragment = document.createDocumentFragment();
  for (let value = BATCH_MIN; value <= BATCH_MAX; value += 1) {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `batchOption${value}`;
    option.className = "batch-wheel-option";
    option.dataset.value = String(value);
    option.setAttribute("role", "option");
    option.tabIndex = -1;
    option.textContent = String(value);
    fragment.append(option);
  }
  els.batchWheel.append(fragment);
  const firstOption = els.batchWheel.querySelector(".batch-wheel-option");
  // offsetHeight is the layout height. getBoundingClientRect() includes the
  // barrel's visual scale transform and caused the selected value to drift.
  batchWheelRowHeight = batchRowHeightFromElement(firstOption);
  setBatchWheelValue(batchWheelValue, { behavior: "auto" });
}

function renderBatchKeypad() {
  const value = Number(keypadDigits);
  const valid = /^\d+$/.test(keypadDigits) && value >= BATCH_MIN && value <= BATCH_MAX;
  els.batchKeypadDisplay.textContent = keypadDigits || "—";
  els.acceptBatchKeypadBtn.disabled = !valid;
  els.batchKeypadStatus.classList.toggle("error", keypadDigits !== "" && !valid);
  els.batchKeypadStatus.textContent = keypadDigits !== "" && !valid
    ? `Gebruik een waarde van ${BATCH_MIN} tot en met ${BATCH_MAX}.`
    : `Kies een waarde van ${BATCH_MIN} tot en met ${BATCH_MAX}.`;
}

function openBatchKeypad() {
  keypadDigits = String(batchWheelValue);
  keypadReplaceOnNextDigit = true;
  renderBatchKeypad();
  if (!els.batchKeypadDialog.open) els.batchKeypadDialog.showModal();
}

function closeBatchKeypad() {
  if (els.batchKeypadDialog.open) els.batchKeypadDialog.close();
}

function enterBatchKey(key) {
  if (key === "clear") {
    keypadDigits = "";
    keypadReplaceOnNextDigit = false;
  } else if (key === "backspace") {
    keypadDigits = keypadReplaceOnNextDigit ? "" : keypadDigits.slice(0, -1);
    keypadReplaceOnNextDigit = false;
  } else if (/^\d$/.test(key)) {
    keypadDigits = keypadReplaceOnNextDigit ? key : `${keypadDigits}${key}`;
    keypadDigits = keypadDigits.replace(/^0+(?=\d)/, "").slice(0, 3);
    keypadReplaceOnNextDigit = false;
  }
  renderBatchKeypad();
}

function faultCodeText() {
  const controllerError = snapshot?.controller?.error;
  if (controllerError && (controllerError.mainCode !== 0 || controllerError.subCode !== 0)) {
    return `${controllerError.mainCode}/${controllerError.subCode}`;
  }
  return String(getInputRegister("CELL_FAULT_CODE"));
}

function faultMessage() {
  if (getInputRegister("CELL_FAULT_CODE") === 991) {
    return "HMI-noodstop actief. Controleer of de cel veilig en vrij is en druk daarna op Reset.";
  }
  return snapshot?.controller?.faultMessage
    || "Processtoring gedetecteerd. Controleer de cel en los de oorzaak op voordat u reset.";
}

function statusText() {
  if (!snapshot?.connected) return ["Offline", "Geen verbinding met bridge"];
  if (getDiscrete("CELL_FAULT_ACTIVE")) return ["Error", faultMessage()];
  if (operatorNotice && Date.now() < operatorNotice.expiresAt) {
    return [operatorNotice.title, operatorNotice.message];
  }
  if (snapshot?.controller?.programMatches === false) {
    const loaded = snapshot.controller.loadedProgram || "onbekend";
    return ["Programma controleren", `Geladen: ${loaded}; Cel inschakelen laadt het juiste productieprogramma`];
  }
  if (snapshot?.controller?.programState === 1) {
    return ["Cel niet ingeschakeld", "Controleer of de cel vrij is en druk op Cel inschakelen"];
  }
  if (snapshot?.controller?.programState === 3) {
    return ["Programma gepauzeerd", "Stop het Lua-programma voordat de cel opnieuw wordt ingeschakeld"];
  }
  if (snapshot?.controller?.programState === 2 && snapshot?.controller?.luaHeartbeatFresh === false) {
    return ["Lua communicatie ontbreekt", "Programma meldt actief, maar de robot-heartbeat verandert niet"];
  }
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
  const faultCode = faultCodeText();

  els.runState.className = "status-pill";
  if (fault) els.runState.classList.add("status-fault");
  else if (running) els.runState.classList.add("status-running");
  else els.runState.classList.add("status-idle");

  els.runState.textContent = title;
  els.activeState.textContent = state.code;
  els.cycleCount.textContent = `Cycles ${cycleCount}`;
  const bridgeOnline = Boolean(snapshot?.connected);
  els.bridgeLamp.classList.toggle("on", bridgeOnline);
  els.bridgeLamp.classList.toggle("error", !bridgeOnline);
  els.bridgeState.title = bridgeOnline
    ? "Bridge heeft een actieve Modbus TCP-verbinding met de Fairino-controller"
    : "Bridge heeft geen Modbus TCP-verbinding met de Fairino-controller";
  const remoteIoOnline = snapshot?.remoteIo?.connected === true;
  els.remoteIoLamp.classList.toggle("on", remoteIoOnline);
  els.remoteIoLamp.classList.toggle("error", !remoteIoOnline);
  els.remoteIoState.title = remoteIoOnline
    ? `M31 Remote IO bereikbaar op ${snapshot.remoteIo.host}:${snapshot.remoteIo.port}`
    : (snapshot?.remoteIo?.error || "M31 Remote IO is niet bereikbaar");
  els.operatorTitle.textContent = title;
  els.operatorMessage.textContent = message;
  els.batchDone.textContent = String(getInputRegister("CELL_BATCH_DONE") || getInputRegister("CELL_CYCLE_COUNT"));
  const currentBatchTarget = normalizeBatchTarget(getHoldingRegister("HMI_BATCH_TARGET"), batchWheelValue);
  els.batchTargetView.textContent = String(currentBatchTarget);
  if (!batchTargetEditing) setBatchWheelValue(currentBatchTarget, { behavior: "auto" });
  const hmiHeartbeat = getHoldingRegister("HMI_HEARTBEAT");
  const robotHeartbeat = getInputRegister("CELL_ROBOT_HEARTBEAT");
  const robotPulse = getDiscrete("CELL_COMMS_OK") ? 1 : 0;
  const robotOnline = snapshot?.connected && snapshot?.controller?.luaHeartbeatFresh === true;

  els.modbusLamp.classList.toggle("on", Boolean(snapshot?.connected));
  els.modbusState.title = snapshot?.connected ? "Modbus TCP bridge heeft verbinding" : "Geen Modbus TCP verbinding";
  els.robotCommsLamp.classList.toggle("on", robotOnline);
  els.robotCommsLamp.classList.toggle("warn", snapshot?.connected && !robotOnline);
  els.robotCommsState.title = robotOnline
    ? "Lua status/heartbeat komt binnen"
    : "Modbus TCP is online, maar de Lua-heartbeat is langer dan de toegestane tijd niet gewijzigd";
  const heartbeatAgeValue = snapshot?.controller?.luaHeartbeatAgeMs;
  const heartbeatTimeoutValue = snapshot?.controller?.luaHeartbeatTimeoutMs;
  const heartbeatAgeMs = Number(heartbeatAgeValue);
  const heartbeatTimeoutMs = Number(heartbeatTimeoutValue);
  const heartbeatTiming = heartbeatAgeValue !== null
    && heartbeatAgeValue !== undefined
    && Number.isFinite(heartbeatAgeMs)
    && Number.isFinite(heartbeatTimeoutMs)
    ? ` / Leeftijd ${(heartbeatAgeMs / 1000).toFixed(1)}s / Limiet ${(heartbeatTimeoutMs / 1000).toFixed(0)}s`
    : "";
  els.heartbeatView.textContent = `HMI HB ${hmiHeartbeat} / Robot pulse ${robotPulse} / Robot HB ${robotHeartbeat}${heartbeatTiming}`;
  els.stateValueView.textContent = `STATE ${state.value}`;

  els.faultBanner.classList.toggle("hidden", !fault);
  els.faultBanner.textContent = fault ? `Error ${faultCode}` : "Geen storing";

  els.lampRed.classList.toggle("on", fault);
  els.lampRed.classList.toggle("fault-flash", fault);
  els.lampAmber.classList.toggle("on", ready && !fault);
  els.lampGreen.classList.toggle("on", running && !fault);
  const cellEnableConfigured = Boolean(snapshot?.capabilities?.cellEnable?.enabled);
  const programState = snapshot?.controller?.programState;
  const programMatches = snapshot?.controller?.programMatches;
  const controllerError = snapshot?.controller?.error;
  const controllerFaultActive = Boolean(controllerError
    && (controllerError.mainCode !== 0 || controllerError.subCode !== 0));
  const controllerResetBlocked = controllerFaultActive
    && snapshot?.controller?.fault?.resettable !== true;
  const cellAlreadyEnabled = programState === 2
    && programMatches === true
    && snapshot?.controller?.luaHeartbeatFresh === true;
  const canEnableCell = cellEnableConfigured
    && snapshot?.connected
    && snapshot?.controller?.rpcConnected
    && !fault
    && !getCoil("HMI_ESTOP_REQ")
    && programState === 1;
  els.enableCellBtn.classList.toggle("hidden", !cellEnableConfigured);
  els.enableCellBtn.disabled = robotActionPending !== null || !canEnableCell;
  els.enableCellBtn.textContent = robotActionPending === "enable"
    ? "Inschakelen..."
    : (cellAlreadyEnabled ? "Cel ingeschakeld" : "Cel inschakelen");
  els.enableCellBtn.title = canEnableCell
    ? "Zet de robot in automatische modus en start het gecontroleerde Lua-programma"
    : "De cel kan alleen vanuit een foutvrije, gestopte programmastatus worden ingeschakeld";
  els.startupNotice.classList.toggle("hidden", !canEnableCell || robotActionPending !== null);
  els.startBtn.disabled = robotActionPending !== null || fault || !cellAlreadyEnabled;
  els.resetBtn.disabled = robotActionPending !== null || controllerResetBlocked;
  els.resetBtn.textContent = robotActionPending === "reset"
    ? "Resetten..."
    : (controllerResetBlocked ? "Reset geblokkeerd" : "Reset");
  els.resetBtn.title = controllerResetBlocked
    ? "Deze controllerstoring is niet als resetbaar gedocumenteerd; schakel technisch personeel in"
    : "Herstel een resetbare storing vanuit de HMI";
  els.stopNotice.classList.toggle(
    "hidden",
    !getCoil("HMI_STOP_REQ") || !running || fault,
  );
}

function renderStations() {
  const state = getState();
  const stations = Array.from(document.querySelectorAll(".station"));
  const stationCodes = stations.map((station) => station.dataset.state);
  const now = Date.now();
  stationTiming.observe(state.code, stationCodes, now);
  const activeIndex = stations.findIndex((station) => station.dataset.state === state.code);
  const cycleComplete = state.code === "S190_CHECK_NEXT_CYCLE"
    || state.code === "S850_BATCH_COMPLETE";

  stations.forEach((station, index) => {
    const active = index === activeIndex;
    const done = cycleComplete || (activeIndex >= 0 && index < activeIndex);
    const wasDone = station.classList.contains("done");
    if (active) {
      const timing = stationTiming.stats(state.code);
      station.style.setProperty("--station-progress", String(stationTiming.progress(state.code, now)));
      station.title = timing.sampleCount > 0
        ? `Gemeten stapduur: ${(timing.durationMs / 1000).toFixed(1)} s (${timing.sampleCount} metingen)`
        : `Verwachte stapduur: ${(timing.durationMs / 1000).toFixed(1)} s; wordt automatisch ingemeten`;
    } else {
      station.style.removeProperty("--station-progress");
      station.removeAttribute("title");
    }
    if (active && wasDone) {
      station.classList.add("progress-reset");
      window.requestAnimationFrame(() => station.classList.remove("progress-reset"));
    }
    station.classList.toggle("active", active);
    station.classList.toggle("done", done);
    if (active) station.setAttribute("aria-current", "step");
    else station.removeAttribute("aria-current");
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

function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes))) return "onbekende grootte";
  const megabytes = Number(bytes) / (1024 * 1024);
  return `${megabytes.toLocaleString("nl-NL", { maximumFractionDigits: 1 })} MB`;
}

function incidentMoment(incident) {
  const date = incident?.faultAt ? new Date(incident.faultAt) : null;
  return date && !Number.isNaN(date.valueOf())
    ? date.toLocaleString("nl-NL")
    : "Onbekend tijdstip";
}

function selectIncident(incident, force = false) {
  if (!incident) return;
  if (!force && loadedIncidentId === incident.id) return;
  loadedIncidentId = incident.id;
  els.faultVideo.src = `/api/video/incidents/${encodeURIComponent(incident.id)}?v=${Date.now()}`;
  els.faultVideo.load();
  els.faultVideo.classList.remove("hidden");
  els.incidentPlayerPlaceholder.classList.add("hidden");
  els.reloadIncidentVideoBtn.disabled = false;
  els.selectedIncidentTitle.textContent = incidentMoment(incident);
  els.selectedIncidentMessage.textContent = incident.faultMessage || "Geen storingsomschrijving opgeslagen";
  const duration = Number.isFinite(Number(incident.durationSeconds))
    ? `${Math.round(Number(incident.durationSeconds))} s`
    : "duur onbekend";
  els.selectedIncidentDetails.textContent = `${duration} · ${formatBytes(incident.sizeBytes)}`;
  renderIncidentList();
}

function renderIncidentList() {
  els.incidentList.innerHTML = "";
  if (incidentLibrary.length === 0) {
    const empty = document.createElement("div");
    empty.className = "incident-list-empty";
    empty.textContent = "Er zijn nog geen storingvideo's opgeslagen.";
    els.incidentList.append(empty);
    return;
  }

  incidentLibrary.forEach((incident) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `incident-item${loadedIncidentId === incident.id ? " active" : ""}`;
    button.addEventListener("click", () => selectIncident(incident));

    if (incident.thumbnailAvailable) {
      const thumbnail = document.createElement("img");
      thumbnail.className = "incident-thumb";
      thumbnail.src = `/api/video/incidents/${encodeURIComponent(incident.id)}/thumbnail`;
      thumbnail.alt = "";
      thumbnail.loading = "lazy";
      button.append(thumbnail);
    } else {
      const thumbnail = document.createElement("span");
      thumbnail.className = "incident-thumb incident-thumb-empty";
      thumbnail.textContent = "Geen beeld";
      button.append(thumbnail);
    }

    const text = document.createElement("span");
    text.className = "incident-item-text";
    const title = document.createElement("strong");
    title.textContent = incidentMoment(incident);
    const message = document.createElement("span");
    message.textContent = incident.faultMessage || "Geen omschrijving";
    text.append(title, message);
    button.append(text);
    els.incidentList.append(button);
  });
}

async function loadIncidentLibrary({ forceSelection = false } = {}) {
  if (incidentRefreshPending) return incidentRefreshPending;
  incidentRefreshPending = api("/api/video/incidents")
    .then((body) => {
      incidentLibrary = Array.isArray(body.incidents) ? body.incidents : [];
      els.incidentRetention.textContent = `Maximaal ${body.maxIncidents || 50} storingen en ${body.retentionDays || 30} dagen`;
      els.incidentCount.textContent = `${incidentLibrary.length} ${incidentLibrary.length === 1 ? "opname" : "opnames"}`;
      const selected = incidentLibrary.find((item) => item.id === loadedIncidentId);
      renderIncidentList();
      if (forceSelection || (!selected && incidentLibrary.length > 0)) selectIncident(incidentLibrary[0], true);
      if (incidentLibrary.length === 0 && loadedIncidentId !== null) clearIncidentPlayer();
    })
    .catch((error) => {
      els.incidentCount.textContent = "Bibliotheek offline";
      els.incidentList.innerHTML = "";
      const failure = document.createElement("div");
      failure.className = "incident-list-empty";
      failure.textContent = error.message;
      els.incidentList.append(failure);
    })
    .finally(() => {
      incidentRefreshPending = null;
    });
  return incidentRefreshPending;
}

function clearIncidentPlayer() {
  loadedIncidentId = null;
  els.faultVideo.removeAttribute("src");
  els.faultVideo.load();
  els.faultVideo.classList.add("hidden");
  els.incidentPlayerPlaceholder.classList.remove("hidden");
  els.reloadIncidentVideoBtn.disabled = true;
  els.selectedIncidentTitle.textContent = "Geen storing geselecteerd";
  els.selectedIncidentMessage.textContent = "";
  els.selectedIncidentDetails.textContent = "";
}

function clearFaultPopupVideo() {
  els.faultPopupVideo.pause();
  els.faultPopupVideo.removeAttribute("src");
  els.faultPopupVideo.load();
  els.faultVideoDialogPlayer.classList.add("hidden");
  els.faultVideoDialog.classList.remove("expanded");
}

function dismissFaultPrompt() {
  if (faultPrompt) faultPrompt.dismissed = true;
  clearFaultPopupVideo();
  if (els.faultVideoDialog.open) els.faultVideoDialog.close();
}

function beginFaultPrompt() {
  const camera = snapshot?.camera || {};
  const activeFault = camera.activeFault || null;
  faultPrompt = {
    baselineIncidentId: camera.latestIncident?.id || null,
    faultAt: activeFault?.faultAt || null,
    incidentId: activeFault?.incidentId || null,
    code: faultCodeText(),
    message: faultMessage(),
    dismissed: false,
  };

  clearFaultPopupVideo();
  els.faultVideoDialogTitle.textContent = `Error ${faultPrompt.code}`;
  els.faultVideoDialogMessage.textContent = faultPrompt.message;
  if (!els.faultVideoDialog.open) els.faultVideoDialog.showModal();
}

function faultVideoPreparationText(camera) {
  if (!camera.enabled || camera.state === "disabled") {
    return "De camera-opname is uitgeschakeld; voor deze storing is geen video beschikbaar.";
  }
  if (camera.error || camera.source?.error) {
    return camera.error || camera.source.error;
  }
  if (camera.state === "post-fault") {
    const remainingMs = Date.parse(camera.postFaultUntil || "") - Date.now();
    const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
    return `De storingvideo wordt voorbereid (nog ongeveer ${seconds} s).`;
  }
  if (camera.state === "finalizing") return "De storingvideo wordt opgeslagen…";
  if (camera.recording) return "De storingvideo wordt voorbereid…";
  return "Voor deze storing is nog geen nieuwe opname beschikbaar.";
}

function updateFaultPrompt() {
  const faultActive = getDiscrete("CELL_FAULT_ACTIVE");
  if (faultActive && lastFaultActive !== true) beginFaultPrompt();
  lastFaultActive = faultActive;

  if (!faultPrompt || faultPrompt.dismissed || !els.faultVideoDialog.open) return;
  if (faultActive) {
    faultPrompt.code = faultCodeText();
    faultPrompt.message = faultMessage();
    els.faultVideoDialogTitle.textContent = `Error ${faultPrompt.code}`;
    els.faultVideoDialogMessage.textContent = faultPrompt.message;
  }
  const camera = snapshot?.camera || { enabled: false, state: "disabled" };
  const activeFault = camera.activeFault;
  if (activeFault?.faultAt) faultPrompt.faultAt = activeFault.faultAt;
  if (activeFault?.incidentId) faultPrompt.incidentId = activeFault.incidentId;

  const latest = camera.latestIncident;
  const latestMatchesFault = latest && (
    (faultPrompt.faultAt && latest.faultAt === faultPrompt.faultAt)
    || (!faultPrompt.faultAt && latest.id !== faultPrompt.baselineIncidentId)
  );
  if (latestMatchesFault) faultPrompt.incidentId = latest.id;

  const videoReady = Boolean(faultPrompt.incidentId);
  els.openFaultVideoBtn.disabled = !videoReady;
  els.faultVideoDialogStatus.textContent = videoReady
    ? "De storingvideo is gereed."
    : faultVideoPreparationText(camera);
}

function liveCameraViews() {
  return [
    {
      tab: "user",
      image: els.userLiveCamera,
      placeholder: els.userLiveCameraPlaceholder,
      inactiveMessage: "Open de User-tab om het livebeeld te laden.",
    },
  ];
}

function stopLiveCamera(message = null) {
  liveCameraViews().forEach((view) => {
    view.image.removeAttribute("src");
    view.image.classList.add("hidden");
    view.placeholder.classList.remove("hidden");
    view.placeholder.textContent = message || view.inactiveMessage;
  });
  liveCameraActive = null;
}

function startLiveCamera(force = false) {
  const source = snapshot?.camera?.source;
  const view = liveCameraViews().find((item) => item.tab === activeTab);
  if (!view || document.hidden || !source?.online) {
    stopLiveCamera(source?.error || "Livebeeld is niet beschikbaar.");
    return;
  }
  if (liveCameraActive === activeTab && !force) return;
  stopLiveCamera("Livebeeld wordt geladen…");
  liveCameraActive = activeTab;
  // An MJPEG response never completes, so Chromium does not reliably emit a
  // normal image `load` event. Reveal the element as soon as the stream starts.
  view.image.classList.remove("hidden");
  view.placeholder.classList.add("hidden");
  view.image.src = `/api/video/live?v=${Date.now()}`;
}

function renderCamera() {
  const camera = snapshot?.camera || { enabled: false, state: "disabled" };
  const source = camera.source || { online: false };
  const cameraLive = source.online === true;
  els.cameraLamp.classList.toggle("on", cameraLive);
  els.cameraLamp.classList.toggle("error", !cameraLive);
  els.cameraState.title = cameraLive
    ? "Live camerabron is online"
    : (source.error || "Live camerabron is offline");

  const resolutionText = `${source.resolution || camera.resolution || "onbekend"} @ ${source.desiredFps || camera.fps || "?"} fps`;
  const recordingText = camera.recording ? "Opnamebuffer actief" : "Geen opname";
  els.userLiveCameraResolution.textContent = resolutionText;
  els.userLiveCameraRecording.textContent = recordingText;
  els.incidentRetention.textContent = `Maximaal ${camera.maxIncidents || 50} storingen en ${camera.retentionDays || 30} dagen`;
  els.incidentCount.textContent = `${camera.incidentCount || 0} ${(camera.incidentCount || 0) === 1 ? "opname" : "opnames"}`;

  if (activeTab === "user") startLiveCamera();
  const signature = `${camera.incidentCount || 0}:${camera.latestIncident?.id || ""}`;
  if (signature !== incidentLibrarySignature) {
    incidentLibrarySignature = signature;
    loadIncidentLibrary();
  }
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
  renderCamera();
  updateFaultPrompt();
}

async function refresh() {
  try {
    snapshot = await api("/api/registers");
    render();
  } catch {
    els.runState.className = "status-pill status-fault";
    els.runState.textContent = "Offline";
    els.bridgeLamp.classList.remove("on");
    els.bridgeLamp.classList.add("error");
    els.remoteIoLamp.classList.remove("on");
    els.remoteIoLamp.classList.add("error");
  }
}

function activateTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
    document.querySelectorAll(".tab-page").forEach((page) => {
      page.classList.toggle("active", page.id === `${activeTab}Tab`);
    });
    if (activeTab !== "advanced") {
      els.ioTestEnable.checked = false;
      renderAdvanced();
    }
    if (activeTab === "user") {
      startLiveCamera();
    } else {
      stopLiveCamera();
      if (activeTab === "camera") loadIncidentLibrary();
    }
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    activateTab(button.dataset.tab);
  });
});

document.querySelector("#startBtn").addEventListener("click", () => command("start"));
document.querySelector("#stopBtn").addEventListener("click", () => command("stop"));
document.querySelector("#estopBtn").addEventListener("click", () => command("estop"));
document.querySelector("#ackBtn").addEventListener("click", () => command("ack"));
els.closeFaultVideoDialogBtn.addEventListener("click", dismissFaultPrompt);
els.faultVideoDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  dismissFaultPrompt();
});
els.openFaultVideoBtn.addEventListener("click", () => {
  if (!faultPrompt?.incidentId) return;
  els.faultVideoDialog.classList.add("expanded");
  els.faultVideoDialogPlayer.classList.remove("hidden");
  els.faultPopupVideo.src = `/api/video/incidents/${encodeURIComponent(faultPrompt.incidentId)}?v=${Date.now()}`;
  els.faultPopupVideo.load();
  els.faultPopupVideo.play().catch(() => {});
});
els.reloadIncidentVideoBtn.addEventListener("click", () => {
  const incident = incidentLibrary.find((item) => item.id === loadedIncidentId);
  if (incident) selectIncident(incident, true);
});
liveCameraViews().forEach((view) => {
  view.image.addEventListener("load", () => {
    if (liveCameraActive !== view.tab) return;
    view.image.classList.remove("hidden");
    view.placeholder.classList.add("hidden");
  });
  view.image.addEventListener("error", () => {
    if (liveCameraActive !== view.tab) return;
    stopLiveCamera("Livebeeld kon niet worden geladen. Controleer de camerabron en probeer opnieuw.");
  });
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLiveCamera();
  else if (activeTab === "user") startLiveCamera(true);
});

document.querySelector("#enableCellBtn").addEventListener("click", async () => {
  robotActionPending = "enable";
  operatorNotice = {
    title: "Cel inschakelen",
    message: "Productieprogramma controleren, automatische modus kiezen en Lua-programma starten",
    expiresAt: Date.now() + 15000,
  };
  renderStatus();

  try {
    await command("enable");
    operatorNotice = {
      title: "Cel ingeschakeld",
      message: "Automatische modus, productieprogramma en robot-heartbeat zijn actief",
      expiresAt: Date.now() + 5000,
    };
  } catch (error) {
    operatorNotice = {
      title: "Inschakelen mislukt",
      message: error.message,
      expiresAt: Date.now() + 10000,
    };
  } finally {
    robotActionPending = null;
    renderStatus();
  }
});

document.querySelector("#resetBtn").addEventListener("click", async () => {
  robotActionPending = "reset";
  els.resetBtn.classList.remove("reset-progress-complete");
  els.resetBtn.classList.add("reset-progress-running");
  operatorNotice = {
    title: "Robot resetten en herstarten",
    message: "Fout wissen, automatische modus inschakelen en Lua-programma starten",
    expiresAt: Date.now() + 10000,
  };
  renderStatus();

  try {
    await command("reset");
    operatorNotice = {
      title: "Reset voltooid",
      message: "Robotfout gewist; automatische modus en Lua-programma actief",
      expiresAt: Date.now() + 5000,
    };
    els.resetBtn.classList.remove("reset-progress-running");
    els.resetBtn.classList.add("reset-progress-complete");
    await new Promise((resolve) => window.setTimeout(resolve, 320));
  } catch (error) {
    operatorNotice = {
      title: "Reset mislukt",
      message: error.message,
      expiresAt: Date.now() + 10000,
    };
  } finally {
    els.resetBtn.classList.remove("reset-progress-running", "reset-progress-complete");
    robotActionPending = null;
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
  post("/api/holding", {
    name: "HMI_BATCH_TARGET",
    value: normalizeBatchTarget(batchWheelValue),
  });
});

els.batchWheel.addEventListener("pointerdown", (event) => {
  batchTargetEditing = true;
  batchWheelPointer = {
    id: event.pointerId,
    y: event.clientY,
    scrollTop: els.batchWheel.scrollTop,
  };
});

els.batchWheel.addEventListener("pointerup", (event) => {
  if (!batchWheelPointer || batchWheelPointer.id !== event.pointerId) return;
  const dragged = Math.abs(event.clientY - batchWheelPointer.y) > 8
    || Math.abs(els.batchWheel.scrollTop - batchWheelPointer.scrollTop) > 5;
  if (dragged) batchWheelSuppressClickUntil = Date.now() + 300;
  batchWheelPointer = null;
});

els.batchWheel.addEventListener("pointercancel", () => {
  batchWheelSuppressClickUntil = Date.now() + 300;
  batchWheelPointer = null;
});

els.batchWheel.addEventListener("wheel", () => {
  batchTargetEditing = true;
}, { passive: true });

els.batchWheel.addEventListener("scroll", () => {
  const value = batchValueFromScroll(els.batchWheel.scrollTop, batchWheelRowHeight);
  if (value !== batchWheelValue) {
    batchWheelValue = value;
    updateBatchWheelAppearance();
  }
}, { passive: true });

els.batchWheel.addEventListener("click", (event) => {
  const option = event.target.closest(".batch-wheel-option");
  if (!option || Date.now() < batchWheelSuppressClickUntil) return;
  const value = normalizeBatchTarget(option.dataset.value);
  batchTargetEditing = true;
  if (value === batchWheelValue) openBatchKeypad();
  else setBatchWheelValue(value);
});

els.batchWheel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    batchTargetEditing = true;
    const direction = event.key === "ArrowDown" ? 1 : -1;
    setBatchWheelValue(batchWheelValue + direction);
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openBatchKeypad();
  }
});

els.batchKeypad.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-key]");
  if (button) enterBatchKey(button.dataset.key);
});

els.batchKeypadDialog.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    enterBatchKey(event.key);
  } else if (event.key === "Backspace") {
    event.preventDefault();
    enterBatchKey("backspace");
  } else if (event.key === "Enter" && !els.acceptBatchKeypadBtn.disabled) {
    event.preventDefault();
    els.acceptBatchKeypadBtn.click();
  }
});

document.querySelector("#closeBatchKeypadBtn").addEventListener("click", closeBatchKeypad);
document.querySelector("#cancelBatchKeypadBtn").addEventListener("click", closeBatchKeypad);
els.batchKeypadDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeBatchKeypad();
});
els.acceptBatchKeypadBtn.addEventListener("click", () => {
  const value = Number(keypadDigits);
  if (!Number.isFinite(value) || value < BATCH_MIN || value > BATCH_MAX) return;
  batchTargetEditing = true;
  setBatchWheelValue(value);
  closeBatchKeypad();
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
initializeBatchWheel();
activateTab(activeTab);
refresh();
