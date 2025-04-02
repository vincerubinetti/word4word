import { createShuffle } from "fast-shuffle";
import seedrandom from "seedrandom";

/** deterministic random */
export const random = seedrandom("Word4Word");

/** deterministic random between range */
export const rand = (min: number, max: number) =>
  Math.round(min + random() * (max - min));

/** deterministic shuffle */
export const shuffle = <Type>(array: Type[]) => createShuffle(31415)(array);
