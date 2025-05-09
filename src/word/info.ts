import type { Response } from "@/word/dictionaryapi";

/** https://github.com/meetDeveloper/freeDictionaryAPI */
const api = "https://api.dictionaryapi.dev/api/v2/entries/en/";

/** lookup definitions and other info about word */
export const getWordInfo = async (word: string) => {
  /** query api */
  const response = await fetch(api + word);
  if (!response.ok) throw Error("Response not OK");
  const results = (await response.json()) as Response;
  if (!Array.isArray(results)) throw Error("Response not an array");

  /** parse response */
  return {
    /** dictionary api results */
    definitions:
      results[0]?.meanings
        ?.map(
          (meaning) =>
            meaning?.definitions?.map((definition) => ({
              description: definition?.definition ?? "",
              part: meaning?.partOfSpeech ?? "",
            })) ?? [],
        )
        .flat()
        .slice(0, 5) ?? [],

    /** audio pronunciation */
    audio: results[0]?.phonetics?.[0]?.audio ?? "",
  };
};
