import {
    ALLOWED_TYPES,
    type ImageContentType,
    type UploadPurpose
} from "./validation.ts" ;

export function createObjectKey(
    purpose: UploadPurpose,
    contentType: ImageContentType,
): string {
    const extension = ALLOWED_TYPES[contentType];

    const filename = crypto.randomUUID();

    return `${purpose}/${filename}.${extension}`;
}