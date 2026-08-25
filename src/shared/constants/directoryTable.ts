/** Keeps directory grids from crushing cells; scroll kicks in below this width. */
export const DIRECTORY_TABLE_MIN_WIDTH_CLASS = "min-w-[44rem]";

/** Wide table scroll shell — horizontal scroll without rubber-band at edges. */
export const TABLE_HORIZONTAL_SCROLL_CLASS =
  "max-w-full overflow-x-auto overscroll-x-none";

/**
 * Header and body use separate grids with the same template. Without this,
 * long cell text sets min-width:auto and each row/header sizes tracks
 * differently — columns look misaligned. Force tracks to share width.
 */
export const DIRECTORY_TABLE_TRACK_ALIGN_CLASS =
  "[&_.grid]:w-full [&_.grid>*]:min-w-0";
