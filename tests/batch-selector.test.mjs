import assert from "node:assert/strict";
import test from "node:test";
import {
  BATCH_MAX,
  BATCH_MIN,
  batchRowHeightFromElement,
  batchValueFromScroll,
  normalizeBatchTarget,
} from "../hmi/batch-selector.mjs";

test("batch targets are whole numbers between 1 and 250", () => {
  assert.equal(BATCH_MIN, 1);
  assert.equal(BATCH_MAX, 250);
  assert.equal(normalizeBatchTarget(-20), 1);
  assert.equal(normalizeBatchTarget(10.6), 11);
  assert.equal(normalizeBatchTarget(999), 250);
  assert.equal(normalizeBatchTarget("42"), 42);
  assert.equal(normalizeBatchTarget("invalid", 10), 10);
});

test("wheel scroll positions resolve to the centered batch value", () => {
  assert.equal(batchValueFromScroll(0, 48), 1);
  assert.equal(batchValueFromScroll(48, 48), 2);
  assert.equal(batchValueFromScroll(48 * 124, 48), 125);
  assert.equal(batchValueFromScroll(48 * 999, 48), 250);
});

test("barrel transforms do not change the row height used for selection", () => {
  const transformedOption = {
    offsetHeight: 56,
    getBoundingClientRect: () => ({ height: 43.68 }),
  };
  const rowHeight = batchRowHeightFromElement(transformedOption);

  assert.equal(rowHeight, 56);
  assert.equal(batchValueFromScroll(56 * 2, rowHeight), 3);
  assert.equal(batchValueFromScroll(56 * 94, rowHeight), 95);
  assert.equal(batchValueFromScroll(56 * 249, rowHeight), 250);
});
