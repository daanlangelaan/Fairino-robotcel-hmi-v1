export const outputTestCoils = Object.freeze([
  { address: 300, output: "DO0", label: "Gripper sluiten" },
  { address: 301, output: "DO1", label: "Clamp sluiten" },
  { address: 305, output: "DO5", label: "Debug clamp OK" },
  { address: 306, output: "DO6", label: "Debug pick OK" },
  { address: 307, output: "DO7", label: "Debug place entered" },
]);

const allowedAddresses = new Set(outputTestCoils.map(({ address }) => address));

export class OutputTestRequestError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "OutputTestRequestError";
    this.statusCode = statusCode;
  }
}

export function parseBooleanFlag(value) {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}

export function parseOutputTestRequest(body, { enabled }) {
  if (!enabled) {
    throw new OutputTestRequestError(403, "IO-test is uitgeschakeld in de serviceconfiguratie");
  }
  if (body?.confirmed !== true) {
    throw new OutputTestRequestError(400, "IO-test moet eerst bewust worden vrijgegeven");
  }

  const address = Number(body.address);
  if (!Number.isInteger(address) || !allowedAddresses.has(address)) {
    throw new OutputTestRequestError(400, "Ongeldig Modbus coil adres");
  }
  if (typeof body.value !== "boolean") {
    throw new OutputTestRequestError(400, "IO-test value moet true of false zijn");
  }

  let pulseMs = 0;
  if (Object.hasOwn(body, "pulseMs")) {
    const requestedPulseMs = Number(body.pulseMs);
    if (!Number.isFinite(requestedPulseMs) || requestedPulseMs <= 0) {
      throw new OutputTestRequestError(400, "Ongeldige IO-test pulsduur");
    }
    pulseMs = Math.max(50, Math.min(5000, Math.round(requestedPulseMs)));
  }

  const resetValue = Object.hasOwn(body, "resetValue")
    ? Boolean(body.resetValue)
    : false;

  return { address, value: body.value, pulseMs, resetValue };
}

export function assertOutputTestInterlock({ running }) {
  if (running) {
    throw new OutputTestRequestError(409, "IO-test geblokkeerd: robotcyclus draait");
  }
}
