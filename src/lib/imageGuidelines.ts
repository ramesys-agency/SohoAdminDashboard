/**
 * Recommended upload sizes, in one place so the same slot never gets two
 * different numbers.
 *
 * Each size is the slot the mobile app actually renders the image into, scaled
 * for a 3x phone screen and rounded. The ratio is the part that matters: the
 * app crops with `cover`, so anything outside the listed shape is cut off
 * rather than letterboxed.
 */

/** Mirrors MAX_IMAGE_BYTES in the backend's upload config. */
export const MAX_IMAGE_UPLOAD_MB = 5;

export interface ImageSpec {
  /** e.g. "1200 × 1600 px" */
  size: string;
  /** e.g. "3:4 portrait" */
  ratio: string;
}

/** Product and variant photos — rendered in 3:4 cards and the product carousel. */
export const PRODUCT_IMAGE_SPEC: ImageSpec = {
  size: "1200 × 1600 px",
  ratio: "3:4 portrait",
};

/** Category artwork — always shown inside a circle, so keep the subject centred. */
export const CATEGORY_IMAGE_SPEC: ImageSpec = {
  size: "800 × 800 px",
  ratio: "1:1 square",
};

/** Dashboard avatars. */
export const AVATAR_IMAGE_SPEC: ImageSpec = {
  size: "400 × 400 px",
  ratio: "1:1 square",
};

/** "Recommended 1200 × 1600 px (3:4 portrait) · JPG, PNG or WebP up to 5 MB" */
export const imageHint = ({ size, ratio }: ImageSpec): string =>
  `Recommended ${size} (${ratio}) · JPG, PNG or WebP up to ${MAX_IMAGE_UPLOAD_MB} MB`;

/** Just the dimensions, for tight spots where the full hint will not fit. */
export const imageSizeHint = ({ size, ratio }: ImageSpec): string =>
  `Recommended ${size} (${ratio})`;
