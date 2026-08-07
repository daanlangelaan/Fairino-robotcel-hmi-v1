import assert from "node:assert/strict";
import test from "node:test";

import { controllerFaultMessage, overlayControllerFault } from "../hmi/controller-status.mjs";

const staleRunningStatus = {
  discreteInputs: [
    { name: "CELL_RUNNING", value: true },
    { name: "CELL_FAULT_ACTIVE", value: false },
    { name: "CELL_READY", value: false },
  ],
  inputRegisters: [
    { name: "CELL_STATE", value: 60 },
    { name: "CELL_FAULT_CODE", value: 0 },
  ],
};

test("controller fault overrides stale Lua running status", () => {
  const result = overlayControllerFault(staleRunningStatus, { mainCode: 4, subCode: 1 });
  const discrete = Object.fromEntries(result.discreteInputs.map((item) => [item.name, item.value]));
  const input = Object.fromEntries(result.inputRegisters.map((item) => [item.name, item.value]));

  assert.equal(result.controllerFaultActive, true);
  assert.equal(discrete.CELL_RUNNING, false);
  assert.equal(discrete.CELL_FAULT_ACTIVE, true);
  assert.equal(input.CELL_FAULT_CODE, 4);
});

test("healthy controller preserves current Lua status", () => {
  const result = overlayControllerFault(staleRunningStatus, { mainCode: 0, subCode: 0 });
  const discrete = Object.fromEntries(result.discreteInputs.map((item) => [item.name, item.value]));

  assert.equal(result.controllerFaultActive, false);
  assert.equal(discrete.CELL_RUNNING, true);
  assert.equal(discrete.CELL_FAULT_ACTIVE, false);
});

test("Lua process faults remain visible when the controller has no fault", () => {
  const status = {
    discreteInputs: [
      { name: "CELL_RUNNING", value: false },
      { name: "CELL_FAULT_ACTIVE", value: true },
    ],
    inputRegisters: [{ name: "CELL_FAULT_CODE", value: 991 }],
  };
  const result = overlayControllerFault(status, { mainCode: 0, subCode: 0 });

  assert.equal(result.faultActive, true);
  assert.equal(result.faultCode, 991);
});

test("explains the resettable axis collision without repeating its code", () => {
  assert.equal(
    controllerFaultMessage({ mainCode: 4, subCode: 1 }),
    "Asbotsing gedetecteerd: de robot heeft onverwachte weerstand op een as gemeten. Verwijder het obstakel en controleer of de arm vrij kan bewegen.",
  );
});

test("uses a safe generic explanation for an unknown controller fault", () => {
  assert.match(
    controllerFaultMessage({ mainCode: 9, subCode: 7 }),
    /Controllerstoring gedetecteerd/,
  );
  assert.equal(controllerFaultMessage({ mainCode: 0, subCode: 0 }), null);
});
