const stateByValue = new Map();
let snapshot = null;
const requestedTab = new URLSearchParams(window.location.search).get("tab");
let activeTab = ["user", "troubleshoot", "camera", "advanced"].includes(requestedTab)
  ? requestedTab
  : "user";
let batchTargetEditing = false;
let lastRobotHeartbeat = null;
let lastRobotHeartbeatAt = 0;
let operatorNotice = null;
let robotActionPending = null;
let loadedIncidentId = null;
let incidentLibrary = [];
let incidentLibrarySignature = "";
let incidentRefreshPending = null;
let liveCameraActive = false;

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
  enableCellBtn: document.querySelector("#enableCellBtn"),
  startBtn: document.querySelector("#startBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  startupNotice: document.querySelector("#startupNotice"),
  stopNotice: document.querySelector("#stopNotice"),
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
  cameraTabBadge: document.querySelector("#cameraTabBadge"),
  cameraStatusText: document.querySelector("#cameraStatusText"),
  cameraSourceState: document.querySelector("#cameraSourceState"),
  cameraState: document.querySelector("#cameraState"),
  liveCameraPlaceholder: document.querySelector("#liveCameraPlaceholder"),
  liveCamera: document.querySelector("#liveCamera"),
  liveCameraResolution: document.querySelector("#liveCameraResolution"),
  liveCameraRecording: document.querySelector("#liveCameraRecording"),
  cameraBufferDetails: document.querySelector("#cameraBufferDetails"),
  cameraSourceDetails: document.querySelector("#cameraSourceDetails"),
  retryLiveCameraBtn: document.querySelector("#retryLiveCameraBtn"),
  incidentRetention: document.querySelector("#incidentRetention"),
  incidentCount: document.querySelector("#incidentCount"),
  incidentList: document.querySelector("#incidentList"),
  incidentPlayerPlaceholder: document.querySelector("#incidentPlayerPlaceholder"),
  faultVideo: document.querySelector("#faultVideo"),
  selectedIncidentTitle: document.querySelector("#selectedIncidentTitle"),
  selectedIncidentMessage: document.querySelector("#selectedIncidentMessage"),
  selectedIncidentDetails: document.querySelector("#selectedIncidentDetails"),
  reloadIncidentVideoBtn: document.querySelector("#reloadIncidentVideoBtn"),
  viewFaultVideoBtn: document.querySelector("#viewFaultVideoBtn"),
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
  els.faultBanner.textContent = fault ? `Error ${faultCode}` : "Geen storing";

  els.lampRed.classList.toggle("on", fault);
  els.lampRed.classList.toggle("fault-flash", fault);
  els.lampAmber.classList.toggle("on", ready && !fault);
  els.lampGreen.classList.toggle("on", running && !fault);
  const cellEnableConfigured = Boolean(snapshot?.capabilities?.cellEnable?.enabled);
  const programState = snapshot?.controller?.programState;
  const programMatches = snapshot?.controller?.programMatches;
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
  els.resetBtn.disabled = robotActionPending !== null;
  els.resetBtn.textContent = robotActionPending === "reset" ? "Resetten..." : "Reset";
  els.stopNotice.classList.toggle(
    "hidden",
    !getCoil("HMI_STOP_REQ") || !running || fault,
  );
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
  els.selectedIncidentTitle.textContent = `Fout ${incident.faultCode ?? "?"} · ${incidentMoment(incident)}`;
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
    title.textContent = `Fout ${incident.faultCode ?? "?"}`;
    const moment = document.createElement("span");
    moment.textContent = incidentMoment(incident);
    const message = document.createElement("span");
    message.textContent = incident.faultMessage || "Geen omschrijving";
    text.append(title, moment, message);
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

function stopLiveCamera(message = "Open de Camera-tab om het livebeeld te laden.") {
  if (liveCameraActive) els.liveCamera.removeAttribute("src");
  liveCameraActive = false;
  els.liveCamera.classList.add("hidden");
  els.liveCameraPlaceholder.classList.remove("hidden");
  els.liveCameraPlaceholder.textContent = message;
}

function startLiveCamera(force = false) {
  const source = snapshot?.camera?.source;
  if (activeTab !== "camera" || document.hidden || !source?.online) {
    stopLiveCamera(source?.error || "Livebeeld is niet beschikbaar.");
    return;
  }
  if (liveCameraActive && !force) return;
  stopLiveCamera("Livebeeld wordt geladen…");
  liveCameraActive = true;
  // An MJPEG response never completes, so Chromium does not reliably emit a
  // normal image `load` event. Reveal the element as soon as the stream starts.
  els.liveCamera.classList.remove("hidden");
  els.liveCameraPlaceholder.classList.add("hidden");
  els.liveCamera.src = `/api/video/live?v=${Date.now()}`;
}

function renderCamera() {
  const camera = snapshot?.camera || { enabled: false, state: "disabled" };
  const source = camera.source || { online: false };
  const stateLabels = {
    disabled: "Uitgeschakeld",
    idle: "Gereed",
    buffering: "Buffer actief",
    "post-fault": "Na-opname",
    finalizing: "Video verwerken",
    "fault-ready": "Bibliotheek gereed",
    error: "Opnamefout",
  };

  els.cameraState.textContent = stateLabels[camera.state] || camera.state;
  els.cameraSourceState.textContent = source.online ? "Bron online" : "Bron offline";
  els.cameraTabBadge.className = "camera-tab-badge";
  if (camera.error || source.error) els.cameraTabBadge.classList.add("error");
  else if (camera.recording) els.cameraTabBadge.classList.add("recording");
  else if (camera.incidentCount > 0) els.cameraTabBadge.classList.add("available");

  if (!camera.enabled) {
    els.cameraStatusText.textContent = "Video-opname is uitgeschakeld in de serviceconfiguratie";
  } else if (camera.error) {
    els.cameraStatusText.textContent = camera.error;
  } else if (camera.state === "buffering") {
    els.cameraStatusText.textContent = `Laatste ${camera.bufferSeconds} seconden van de productiecyclus worden tijdelijk onthouden`;
  } else if (camera.state === "post-fault") {
    els.cameraStatusText.textContent = `Storing gezien; nog ${camera.postFaultSeconds} seconden na de fout worden vastgelegd`;
  } else if (camera.state === "finalizing") {
    els.cameraStatusText.textContent = "Foutfragment wordt veilig samengesteld; dit kan enkele seconden duren";
  } else if (camera.incidentCount > 0) {
    els.cameraStatusText.textContent = "Livebeeld is beschikbaar en opgeslagen storingen kunnen worden teruggekeken";
  } else {
    els.cameraStatusText.textContent = "De opname start automatisch zodra een productiecyclus begint";
  }

  els.liveCameraResolution.textContent = `${source.resolution || camera.resolution || "onbekend"} @ ${source.desiredFps || camera.fps || "?"} fps`;
  els.liveCameraRecording.textContent = camera.recording ? "Opnamebuffer actief" : "Geen opname";
  els.cameraBufferDetails.textContent = `Buffer: ${camera.bufferSeconds || 60} s vóór + ${camera.postFaultSeconds || 0} s na een fout`;
  els.cameraSourceDetails.textContent = source.online
    ? `USB-camera online${Number.isFinite(source.capturedFps) ? ` · werkelijk ${source.capturedFps.toLocaleString("nl-NL", { maximumFractionDigits: 1 })} fps` : ""}`
    : (source.error || "Camerabron niet bereikbaar");
  els.incidentRetention.textContent = `Maximaal ${camera.maxIncidents || 50} storingen en ${camera.retentionDays || 30} dagen`;
  els.incidentCount.textContent = `${camera.incidentCount || 0} ${(camera.incidentCount || 0) === 1 ? "opname" : "opnames"}`;
  els.viewFaultVideoBtn.classList.toggle("hidden", !camera.incidentCount);

  if (activeTab === "camera") startLiveCamera();
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
    if (activeTab === "camera") {
      startLiveCamera();
      loadIncidentLibrary();
    } else {
      stopLiveCamera();
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
els.viewFaultVideoBtn.addEventListener("click", async () => {
  activateTab("camera");
  await loadIncidentLibrary({ forceSelection: true });
});
els.reloadIncidentVideoBtn.addEventListener("click", () => {
  const incident = incidentLibrary.find((item) => item.id === loadedIncidentId);
  if (incident) selectIncident(incident, true);
});
els.retryLiveCameraBtn.addEventListener("click", () => startLiveCamera(true));
els.liveCamera.addEventListener("load", () => {
  els.liveCamera.classList.remove("hidden");
  els.liveCameraPlaceholder.classList.add("hidden");
});
els.liveCamera.addEventListener("error", () => {
  stopLiveCamera("Livebeeld kon niet worden geladen. Controleer de camerabron en probeer opnieuw.");
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLiveCamera();
  else if (activeTab === "camera") startLiveCamera(true);
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
  } catch (error) {
    operatorNotice = {
      title: "Reset mislukt",
      message: error.message,
      expiresAt: Date.now() + 10000,
    };
  } finally {
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
activateTab(activeTab);
refresh();
