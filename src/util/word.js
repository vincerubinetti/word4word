export class Word {
  constructor(word, index, type) {
    this.index = index;
    this.type = type;
    this.text = word;
    this.links = [];
  }
}

export const oneLetterDifferent = (wordA, wordB) => {
  let diff = 0;
  for (let index = 0; index < 4; index++) {
    if (wordA.text[index] !== wordB.text[index])
      diff++;
  }

  return diff === 1;
};

export const linkWords = (wordA, wordB) => wordA.links.push(wordB);

export const findPath = (wordA, wordB) => {
  const explored = {};
  const previous = {};

  const list = [wordA];
  explored[wordA.index] = true;

  while (list.length > 0) {
    let word = list.shift();
    for (const link of word.links) {
      if (link === wordB) {
        const path = [link];
        while (word) {
          path.push(word);
          word = previous[word.index];
        }
        path.reverse();
        return path;
      } else if (!explored[link.index]) {
        list.push(link);
        explored[link.index] = true;
        previous[link.index] = word;
      }
    }
  }

  return [];
};
