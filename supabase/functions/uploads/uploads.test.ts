
import test from "node:test";
import assert from "node:assert/strict";

import { validateUpload } from "./validation.ts";
import { createObjectKey } from "./keys.ts";

const MAX_SIZE = 10 * 1024 * 1024;

// Test 1: Valid upload
test("accepts valid image uploads", () => {
  assert.equal(
    validateUpload("gallery", "image/jpeg", 1000),
    true,
  );

  assert.equal(
    validateUpload("poster", "image/png", MAX_SIZE),
    true,
  );
});

// Test 2: Invalid purpose
test("rejects invalid purposes", () => {
  assert.equal(
    validateUpload("video", "image/jpeg", 1000),
    false,
  );
});

// Test 3: Invalid content type
test("rejects unsupported file types", () => {
  assert.equal(
    validateUpload("gallery", "application/pdf", 1000),
    false,
  );
});

// Test 4: Invalid size
test("rejects invalid file sizes", () => {
  assert.equal(validateUpload("gallery", "image/jpeg", 0), false);
  assert.equal(validateUpload("gallery", "image/jpeg", -1), false);
  assert.equal(validateUpload("gallery", "image/jpeg", MAX_SIZE + 1), false);
  assert.equal(validateUpload("gallery", "image/jpeg", 1.5), false);
});

// Test 5: Generated keys
test("generates a valid object key", () => {
  const key = createObjectKey("gallery", "image/jpeg");

  assert.match(key, /^gallery\/[a-f0-9-]+\.jpg$/);
});

// Test 6: Unique filenames
test("generates unique filenames", () => {
  const key1 = createObjectKey("gallery", "image/jpeg");
  const key2 = createObjectKey("gallery", "image/jpeg");

  assert.notEqual(key1, key2);
});

test("rejects inherited object properties", () => {
  assert.equal(
    validateUpload("gallery", "toString", 1000),
    false,
  );
});
