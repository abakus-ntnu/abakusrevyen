
export const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

const ALLOWED_PURPOSES = [
  "gallery",
  "post",
  "poster",
  "thumbnail",
] as const;

// Foreløpig grense på 10 MiB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type UploadPurpose =
  (typeof ALLOWED_PURPOSES)[number];

export type ImageContentType =
  keyof typeof ALLOWED_TYPES;

export function validateUpload(
  purpose: string,
  contentType: string,
  size: number,
): boolean {
  if (!ALLOWED_PURPOSES.includes(purpose as UploadPurpose)) {
    return false;
  }

  if (!Object.hasOwn(ALLOWED_TYPES, contentType)) {
  return false;
}

  if (!Number.isSafeInteger(size) ||
      size <= 0 ||
      size > MAX_FILE_SIZE) {
    return false;
  }

  return true;
}

