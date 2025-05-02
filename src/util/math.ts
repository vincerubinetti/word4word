import { createShuffle } from "fast-shuffle";

/** deterministic shuffle */
export const shuffle = <Type>(array: Type[]) => createShuffle(31415)(array);
