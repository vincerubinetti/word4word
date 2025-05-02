import { filter } from "lodash";
import rawDictionary from "@/data/dictionary.yaml?raw";
import { useQuery } from "@/util/composables";
import { oneLetterDifferent, type Pars, type Word } from "@/word";

/** par data in public */
const rawPars = import.meta.env.BASE_URL + "pars.dat";

/** par that represents infinity (no possible path) */
export let infinitePar = 999;

/** highest par possible (other than infinity) */
export let maxPar = 99;

/** load game data */
export const loadData = async () => {
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
  /** get words corresponding to pars triangular matrix */
  const matrixWords: { a: Word; b: Word }[] = [];
  regularWords.forEach((a, aIndex) =>
    regularWords.forEach((b, bIndex) => {
      ``;
      /** triangular */
      if (aIndex < bIndex) matrixWords.push({ a, b });
    }),
  );

  /** read triangular matrix of par lengths */
  const parsMatrix = new Uint8Array(await (await fetch(rawPars)).arrayBuffer());
  for (let index = 0; index < parsMatrix.length; index++) {
    /** get par, add one step to include end word */
    let par = parsMatrix[index]! + 1;
    /** add word pair */
    pars[par] ??= [];
    pars[par]?.push(matrixWords[index]!);
  }

  /** update par limits from actual data */
  infinitePar = pars.length - 1;
  maxPar = pars.slice(0, -1).findLastIndex(Boolean);

  /** util func */
  const lookupWord = (text: string) => {
    if (!text.trim()) return;
    text = text.toLowerCase();
    return dictionary.find(
      (word) => word.text === text && word.type !== "obscure",
    );
  };

  return { dictionary, pars, lookupWord };
};

/** global game data and state */
const query = useQuery(loadData);
export const run = query.run;
export const data = query.data;
export const status = query.status;
