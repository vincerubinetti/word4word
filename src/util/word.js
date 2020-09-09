export class Word {
  constructor(word, index, type) {
    this.index = index;
    this.type = type;
    this.text = word;
    this.links = [];
    this.linkCount = [];
  }

  oneDifferent(otherWord) {
    if (this.text.length !== otherWord.text.length)
      return false;

    let diff = 0;
    for (let index = 0; index < this.text.length; index++) {
      if (this.text[index] !== otherWord.text[index])
        diff++;
    }


    return diff === 1;
  }

  link(otherWord) {
    this.links.push(otherWord);
  }

  findPath(otherWord) {
    const wordA = this;
    const wordB = otherWord;

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
  }
}
