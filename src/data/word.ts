import { differenceInCalendarWeeks, getDate, getDay } from "date-fns";
import { clamp, filter, range } from "lodash";
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
  const regularWords = filter(dictionary, { type: "regular" });
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

    pars[par] ??= [];
    /** add word pair */
    pars[par]?.push(matrixWords[index]!);
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
    if (!anyType) links = filter(links, { type: "regular" });
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

/** get daily challenge */
export const getDaily = (pars: Pars, today = new Date()) => {
  /** get date info */
  const epoch = new Date(2000, 0, 0, 0, 0);
  const day = getDay(today);
  const date = getDate(today);
  const weeks = differenceInCalendarWeeks(today, epoch);

  /** increase difficulty over week, like NYT games */
  let dayPar = 3;
  if (day === 1) dayPar = 4;
  if (day === 2) dayPar = 6;
  if (day === 3) dayPar = 8;
  if (day === 4) dayPar = 10;
  if (day === 5) dayPar = 12;
  if (day === 6) dayPar = 14;
  if (day === 0) dayPar = 16;

  /** increase difficulty over month */
  let datePar = 0;
  if (date <= 7) datePar = 1;
  else if (date <= 14) datePar = 2;
  else if (date <= 21) datePar = 3;
  else if (date <= 28) datePar = 4;
  else datePar = 5;

  /** final par */
  const par = clamp(dayPar + datePar, 3, pars.length);

  /** number of word pairs in chosen par */
  const pairs = pars[par]?.length ?? 0;

  /** select random but deterministic pair from par */
  const pair = shuffle(range(0, pairs))[weeks % pairs] ?? 0;

  /** get word pair */
  const daily = pars[par]?.[pair];

  console.debug({ day, date, dayPar, datePar, par, pairs, pair });

  if (!daily) throw Error("Couldn't get daily");

  return daily;
};
