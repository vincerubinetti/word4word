import { createShuffle } from "fast-shuffle";
import { clamp } from "lodash";

/** deterministic shuffle */
export const shuffle = <Type>(array: Type[]) => createShuffle(31415)(array);

/** linearly interpolate */
export const lerp = (
  value: number,
  sourceMin: number,
  sourceMax: number,
  targetMin: number,
  targetMax: number,
) => {
  let percent = (value - sourceMin) / (sourceMax - sourceMin);
  percent = clamp(percent, 0, 1);
  return targetMin + percent * (targetMax - targetMin);
};
