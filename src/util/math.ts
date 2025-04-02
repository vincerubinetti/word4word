import { createShuffle } from "fast-shuffle";
import { clamp } from "lodash";
import seedrandom from "seedrandom";

/** deterministic random */
export const random = seedrandom("Word4Word");

/** deterministic random between range */
export const rand = (min: number, max: number) =>
  Math.round(min + random() * (max - min));

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
