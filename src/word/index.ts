import { differenceInCalendarDays, getDate, getDay } from "date-fns";
import { clamp, range } from "lodash";
import { maxPar } from "@/data";
import { shuffle } from "@/util/math";

export type Word = {
  text: string;
  type: "regular" | "special" | "obscure";
  links: Word[];
};

export type Pars = (undefined | { a: Word; b: Word }[])[];

/** are words 1 letter apart */
export const oneLetterDifferent = (a: string, b: string) => {
  if (a.length !== 4 || b.length !== 4) return false;
  let diff = 0;
  for (let index = 0; index < 4; index++) if (a[index] !== b[index]) diff++;
  return diff === 1;
};

/** find shortest path between two words */
export const findPath = (
  a: Word,
  b: Word,
  types: Word["type"][] = ["regular"],
) => {
  if (a.text === b.text) return [a];
  if (!types.includes(a.type)) return [];
  if (!types.includes(b.type)) return [];

  /** breadth first search */

  /** per-node records */
  const explored: Record<Word["text"], boolean> = {};
  const previous: Record<Word["text"], Word> = {};

  /** list of nodes to explore */
  const list = [a];
  /** mark start as explored */
  explored[a.text] = true;

  let word: Word | undefined;
  /** get next word */
  while ((word = list.shift())) {
    /** get next links */
    let links = word.links ?? [];
    /** only get links of certain type(s) */
    links = links.filter((link) => types.includes(link.type));
    /** for each link */
    for (const link of links) {
      /** if we found end */
      if (link === b) {
        /** construct path */
        const path = [link];
        /** walk back to start, following each previous */
        while (word) {
          path.push(word);
          word = previous[word.text];
        }
        /** flip end to start */
        path.reverse();
        return path;
      } else if (!explored[link.text]) {
        /** explore link next */
        list.push(link);
        /** mark link as explored */
        explored[link.text] = true;
        /** track where we came from */
        previous[link.text] = word;
      }
    }
  }

  return [];
};

/** daily calculation cache */
const cache = new Map<
  { day: number; week: number; days: number },
  { a: Word; b: Word }
>();

/** increase difficulty over day of week (1-7) and week of month (1-5) */
export const difficulties = [
  [4, 5, 6, 7, 8, 9, 10],
  [6, 7, 8, 9, 10, 11, 12],
  [8, 9, 10, 11, 12, 13, 14],
  [10, 11, 12, 13, 14, 15, 16],
  [12, 13, 14, 15, 16, 17, 18],
];

/** get daily game */
export const getDaily = (pars: Pars, today = new Date()) => {
  /** get date info */
  const epoch = new Date(2000, 0, 0, 0, 0);
  let day = getDay(today);
  const week = Math.floor(getDate(today) / 7);
  const days = differenceInCalendarDays(today, epoch);

  /** start week on monday */
  day--;
  if (day < 0) day += 7;

  /** get cached */
  const cacheKey = { day, week, days };
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  /** get par */
  const par = clamp(
    difficulties[week]?.[day] ?? 0,
    /** less than this not fun */
    4,
    /**
     * very few pairs around max par (will cause repeats too soon), so go a few
     * pars below
     */
    maxPar - 2,
  );

  /** number of word pairs in chosen par */
  const pairs = pars[par]?.length ?? 0;

  /** select random but deterministic pair from par */
  const pair = shuffle(range(0, pairs))[days % pairs] ?? 0;

  /** get word pair */
  const daily = pars[par]?.[pair];

  console.debug({ day, week, days, par, pairs, pair });

  if (!daily) throw Error("Couldn't determine daily game");

  /** set cache */
  cache.set(cacheKey, daily);

  return daily;
};
