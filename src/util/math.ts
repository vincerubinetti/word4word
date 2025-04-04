import { createShuffle } from "fast-shuffle";
import { clamp, range } from "lodash";

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

/** trig funcs in degrees */
export const sin = (degrees: number) => Math.sin(2 * Math.PI * (degrees / 360));
export const cos = (degrees: number) => Math.cos(2 * Math.PI * (degrees / 360));

/** generate star points */
export const star = (
  points: number,
  ratio: number,
  radius: number,
  x: number,
  y: number,
) =>
  range(0, 360, 360 / (points * 2))
    .concat([360])
    .map((angle, index) => ({
      x: x + sin(angle) * (radius * (index % 2 ? 1 : ratio)),
      y: y + cos(angle) * (radius * (index % 2 ? 1 : ratio)),
    }));

// console.debug(
//   star(5, 0.5, 50, 50, 50)
//     .map(({ x, y }) => `${x.toFixed(0)}% ${y.toFixed(0)}%`)
//     .join(", "),
// );
