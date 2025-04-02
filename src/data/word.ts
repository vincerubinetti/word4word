import { differenceInCalendarWeeks, getDay, getWeekOfMonth } from "date-fns";
import { clamp, range } from "lodash";
import { shuffle } from "@/util/math";
import rawDictionary from "./dictionary.yaml?raw";

const rawPars = "/pars.dat";

export type Word = {
  text: string;
  type: "regular" | "special" | "obscure";
  links: Word[];
};

export type Pars = (undefined | { a: Word; b: Word }[])[];

/** load dictionary and par data */
export const loadData = async () => {
  // await sleep(1000);

  /** parse raw dictionary yaml */
  const dictionary = rawDictionary
    .split("\n")
    .map((line) => line.split(": ") as [Word["text"], Word["type"]])
    .map(([text, type]): Word => ({ text, type, links: [] }))
    .filter(({ text }) => text.trim());

  /** link words together */
  for (const a of dictionary)
    for (const b of dictionary)
      if (oneLetterDifferent(a.text, b.text)) a.links.push(b);

  /**
   * par: shortest path length between each pair of words in reg dictionary.
   * array where each item holds pars of length equal to index, i.e. pars[5]
   * contains all pairs of words of par 5
   */
  const pars: Pars = [];

  /** get words in regular dictionary */
  const regularWords = dictionary.filter(({ type }) => type === "regular");
  /** get words corresponding to pars matrix */
  const matrixWords: { a: Word; b: Word }[] = [];
  regularWords.forEach((a, aIndex) =>
    regularWords.forEach((b, bIndex) => {
      /** upper-triangular */
      if (aIndex < bIndex) matrixWords.push({ a, b });
    }),
  );

  /** read triangular matrix of par lengths */
  const parsMatrix = new Uint8Array(await (await fetch(rawPars)).arrayBuffer());
  for (let index = 0; index < parsMatrix.length; index++) {
    /** get par, make 1-indexed instead of 0-indexed */
    let par = parsMatrix[index]! + 1;

    /** if 64 (max 8-bit int), par is infinity (i.e. no possible path) */
    if (par < 64) {
      pars[par] ??= [];
      /** add word pair */
      pars[par]?.push(matrixWords[index]!);
    }
  }

  /** util func */
  const lookupWord = (text: string) => {
    if (!text.trim()) return;
    text = text.toLowerCase();
    return dictionary.find((word) => word.text === text);
  };

  return { dictionary, pars, lookupWord };
};

/** are words 1 letter apart */
export const oneLetterDifferent = (a: string, b: string) => {
  if (a.length !== 4 || b.length !== 4) return false;
  let diff = 0;
  for (let index = 0; index < 4; index++) if (a[index] !== b[index]) diff++;
  return diff === 1;
};

/** find shortest path between two words, breadth first search */
export const findPath = (a: Word, b: Word, anyType = false) => {
  if (a.text === b.text) return [a];

  const explored: Record<Word["text"], boolean> = {};
  const previous: Record<Word["text"], Word> = {};

  const list = [a];
  explored[a.text] = true;

  while (list.length > 0) {
    let word = list.shift();
    let links = word?.links ?? [];
    if (!anyType) links = links.filter(({ type }) => type === "regular");
    for (const link of links) {
      if (link === b) {
        const path = [link];
        while (word) {
          path.push(word);
          word = previous[word.text];
        }
        path.reverse();
        return path;
      } else if (!explored[link.text]) {
        list.push(link);
        explored[link.text] = true;
        if (word) previous[link.text] = word;
      }
    }
  }

  return [];
};

export const getDaily = (pars: Pars) => {
  /** get date info */
  const today = new Date();
  const epoch = new Date(2000, 0, 0, 0, 0);
  const day = getDay(today);
  const week = getWeekOfMonth(today);
  const weeks = differenceInCalendarWeeks(today, epoch);

  /** set difficulty based on day of week, like NYT games */
  let par = 3;
  if (day === 1) par = 4;
  if (day === 2) par = 6;
  if (day === 3) par = 8;
  if (day === 4) par = 10;
  if (day === 5) par = 12;
  if (day === 6) par = 14;
  if (day === 0) par = 16;

  /** increase in difficulty over month */
  par += week;
  par = clamp(par, 3, pars.length);

  /** number of pairs in chosen par */
  const pairs = pars[par]?.length ?? 0;

  /** select random but deterministic pair from par */
  const pair =
    shuffle(range(0, Math.min(weeks, pairs) + 1))[weeks % pairs] ?? 0;

  /** get word pair */
  const daily = pars[par]?.[pair];

  if (!daily) throw Error(`Couldn't get daily, par ${par}, pair ${pair}`);

  return daily;
};
