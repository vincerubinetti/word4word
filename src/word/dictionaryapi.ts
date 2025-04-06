/** https://github.com/meetDeveloper/freeDictionaryAPI/issues/232 */

export type Response = Result[];

type Result = {
  word?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  license?: License;
  sourceUrls?: string[];
};

type License = {
  name?: string;
  url?: string;
};

type Meaning = {
  partOfSpeech?: string;
  definitions?: Definition[];
  synonyms?: string[];
  antonyms?: string[];
};

type Definition = {
  definition?: string;
  synonyms?: any[];
  antonyms?: any[];
  example?: string;
};

type Phonetic = {
  audio?: string;
  sourceUrl?: string;
  license?: License;
  text?: string;
};
