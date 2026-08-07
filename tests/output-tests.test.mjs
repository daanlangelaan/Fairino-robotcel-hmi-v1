import assert from "node:assert/strict";
import test from "node:test";

import {
  assertOutputTestInterlock,
  outputTestCoils,
  OutputTestRequestError,
  parseBooleanFlag,
  parseOutputTestRequest,
} from "../hmi/output-tests.mjs";

test("uses Daan's exact active-low output-test allowlist", () => {
  assert.deepEqual(outputTestCoils.map(({ address }) => address), [300, 301, 305, 306, 307]);
});

test("requires the server feature flag and explicit UI confirmation", () => {
  assert.throws(
    () => parseOutputTestRequest({ address: 300, value: false, confirmed: true }, { enabled: false }),
    (error) => error instanceof OutputTestRequestError && error.statusCode === 403,
  );
  assert.throws(
    () => parseOutputTestRequest({ address: 300, value: false }, { enabled: true }),
    (error) => error instanceof OutputTestRequestError && error.statusCode === 400,
  );
});

test("rejects unlisted coils and non-boolean values", () => {
  assert.throws(
    () => parseOutputTestRequest({ address: 302, value: false, confirmed: true }, { enabled: true }),
    (error) => error instanceof OutputTestRequestError && error.statusCode === 400,
  );
  assert.throws(
    () => parseOutputTestRequest({ address: 300, value: 0, confirmed: true }, { enabled: true }),
    (error) => error instanceof OutputTestRequestError && error.statusCode === 400,
  );
});

test("normalizes Daan-compatible active-low pulse commands", () => {
  assert.deepEqual(
    parseOutputTestRequest({
      address: 301,
      value: false,
      pulseMs: 500,
      resetValue: true,
      confirmed: true,
    }, { enabled: true }),
    { address: 301, value: false, pulseMs: 500, resetValue: true },
  );
});

test("blocks output tests while the robot cycle is running", () => {
  assert.throws(
    () => assertOutputTestInterlock({ running: true }),
    (error) => error instanceof OutputTestRequestError && error.statusCode === 409,
  );
  assert.doesNotThrow(() => assertOutputTestInterlock({ running: false }));
});

test("parses explicit feature-flag values", () => {
  assert.equal(parseBooleanFlag("true"), true);
  assert.equal(parseBooleanFlag("1"), true);
  assert.equal(parseBooleanFlag("false"), false);
  assert.equal(parseBooleanFlag(undefined), false);
});
