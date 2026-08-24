import assert from "node:assert/strict";
import test from "node:test";

import {
  controllerFaultInfo,
  controllerFaultMessage,
  overlayControllerFault,
} from "../hmi/controller-status.mjs";

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

test("latched HMI Noodstop overrides stale running status even after Lua stops", () => {
  const result = overlayControllerFault(
    staleRunningStatus,
    { mainCode: 0, subCode: 0 },
    { hmiEstopActive: true },
  );
  const discrete = Object.fromEntries(result.discreteInputs.map((item) => [item.name, item.value]));

  assert.equal(discrete.CELL_RUNNING, false);
  assert.equal(discrete.CELL_FAULT_ACTIVE, true);
  assert.equal(result.faultCode, 991);
});

test("stopped controller overrides stale Lua running status", () => {
  const result = overlayControllerFault(
    staleRunningStatus,
    { mainCode: 0, subCode: 0 },
    { controllerProgramState: 1 },
  );
  const discrete = Object.fromEntries(result.discreteInputs.map((item) => [item.name, item.value]));

  assert.equal(discrete.CELL_RUNNING, false);
  assert.equal(discrete.CELL_FAULT_ACTIVE, false);
});

test("unexpected loaded program overrides stale Lua running status", () => {
  const result = overlayControllerFault(
    staleRunningStatus,
    { mainCode: 0, subCode: 0 },
    { controllerProgramState: 2, controllerProgramMatches: false },
  );
  const discrete = Object.fromEntries(result.discreteInputs.map((item) => [item.name, item.value]));

  assert.equal(discrete.CELL_RUNNING, false);
  assert.equal(discrete.CELL_FAULT_ACTIVE, false);
});

test("stale Lua heartbeat overrides stale running status", () => {
  const result = overlayControllerFault(
    staleRunningStatus,
    { mainCode: 0, subCode: 0 },
    {
      controllerProgramState: 2,
      controllerProgramMatches: true,
      luaHeartbeatFresh: false,
    },
  );
  const discrete = Object.fromEntries(result.discreteInputs.map((item) => [item.name, item.value]));

  assert.equal(discrete.CELL_RUNNING, false);
  assert.equal(discrete.CELL_FAULT_ACTIVE, false);
});

test("shows the documented axis number and HMI recovery for collision faults", () => {
  assert.equal(
    controllerFaultMessage({ mainCode: 4, subCode: 1 }),
    "Botsing op as 1 gedetecteerd. Verwijder de botsingsoorzaak, controleer dat de volledige robotbaan en cel vrij zijn en druk daarna eenmaal op Reset.",
  );
  assert.equal(
    controllerFaultMessage({ mainCode: 4, subCode: 2 }),
    "Botsing op as 2 gedetecteerd. Verwijder de botsingsoorzaak, controleer dat de volledige robotbaan en cel vrij zijn en druk daarna eenmaal op Reset.",
  );
});

test("uses safe HMI instructions for a documented configuration fault", () => {
  const message = controllerFaultMessage({ mainCode: 9, subCode: 7 });
  assert.match(message, /Robotmodel komt niet overeen/);
  assert.match(message, /niet resetbaar via de HMI/);
  assert.match(message, /technisch personeel/);
  assert.doesNotMatch(message, /WebApp|web app/i);
  assert.equal(controllerFaultMessage({ mainCode: 0, subCode: 0 }), null);
});

test("keeps controller fault 4/2 entirely actionable from the HMI", () => {
  const message = controllerFaultMessage({ mainCode: 4, subCode: 2 });
  assert.match(message, /Botsing op as 2/);
  assert.match(message, /robotbaan en cel vrij/);
  assert.match(message, /Reset/);
  assert.doesNotMatch(message, /WebApp|web app/i);
});

test("distinguishes documented resettable and non-resettable faults", () => {
  assert.equal(controllerFaultInfo({ mainCode: 4, subCode: 7 })?.resettable, true);
  assert.equal(controllerFaultInfo({ mainCode: 2, subCode: 2 })?.resettable, false);
  assert.equal(controllerFaultInfo({ mainCode: 1, subCode: 30 })?.resettable, false);
  assert.equal(controllerFaultInfo({ mainCode: 10, subCode: 1 })?.resettable, null);
  assert.match(
    controllerFaultMessage({ mainCode: 2, subCode: 2 }),
    /Aandrijffout op as 2.*niet resetbaar via de HMI/,
  );
  assert.match(
    controllerFaultMessage({ mainCode: 10, subCode: 1 }),
    /Singuliere robothouding.*robotpositie en het programma controleren/,
  );
});

test("covers every motion-controller main/subcode in the Fairino appendix", () => {
  const documentedFaultSubcodes = new Map([
    [1, [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      33, 34, 35, 36, 37, 38, 49, 50, 51, 52, 53, 54, 55, 56, 65, 66,
      81, 82, 83, 84, 97, 113, 114, 115, 116, 117, 118, 119, 120, 121,
      122, 123, 129, 130, 147, 148, 149,
    ]],
    [2, [1, 2, 3, 4, 5, 6]],
    [3, [1, 2, 3, 4, 5, 6]],
    [4, [1, 2, 3, 4, 5, 6, 7]],
    [5, [1]],
    [6, [1, 2, 3, 4, 5, 6]],
    [7, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    [8, [1]],
    [9, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
    [10, [1]],
    [11, [1, 2, 3, 4, 5, 6]],
    [12, [1, 2, 3, 4]],
    [13, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]],
  ]);

  for (const [mainCode, subCodes] of documentedFaultSubcodes) {
    for (const subCode of subCodes) {
      assert.ok(
        controllerFaultInfo({ mainCode, subCode }),
        `Fairino controller fault ${mainCode}/${subCode} is missing`,
      );
    }
  }
});

test("unknown codes keep their code on the HMI and never send the operator to the WebApp", () => {
  const message = controllerFaultMessage({ mainCode: 99, subCode: 42 });
  assert.match(message, /Onbekende controllerstoring/);
  assert.match(message, /foutcode blijft zichtbaar op de HMI/i);
  assert.doesNotMatch(message, /WebApp|web app/i);
});
