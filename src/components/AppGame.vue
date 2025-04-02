<template>
  <section>
    <div class="row">
      <div>Par: {{ par.length }}</div>
      <div>Yours: {{ aPath.length + bPath.length }}</div>
    </div>

    <div class="path">
      <template v-for="(word, wordIndex) in aPath" :key="wordIndex">
        <Star v-if="word.type === 'special'" class="special filled" />
        <div
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :class="[
            'char',

            aPath[wordIndex - 1] &&
              char !== aPath[wordIndex - 1]?.text[charIndex] &&
              'link',
          ]"
          :style="{
            '--char': charIndex,
            '--strength': strengths[word.text],
          }"
        >
          {{ char }}
        </div>
        <button
          v-if="!won && wordIndex === aPath.length - 1 && aPath.length > 1"
          class="square right"
          title="Delete word"
          @click="aPath = aPath.slice(0, -1)"
        >
          <X />
        </button>
      </template>

      <template v-if="!won">
        <div class="spacer"></div>

        <input
          ref="inputElement"
          v-model="input"
          class="middle"
          maxlength="4"
          @change="submit"
          @keydown.enter="submit"
        />

        <button class="square" title="Reverse path" @click="reverse">
          <ArrowUpDown />
        </button>

        <button class="square" title="Get hint" @click="hint">
          <Lightbulb />
        </button>

        <button class="square" title="Clear input" @click="input = ''">
          <X />
        </button>

        <button class="primary square" title="Submit word" @click="submit">
          <Check />
        </button>

        <div class="spacer"></div>
      </template>

      <template v-for="(word, wordIndex) in bPath" :key="wordIndex">
        <Star v-if="word.type === 'special'" class="special filled" />
        <div
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :class="[
            'char',

            bPath[wordIndex - 1] &&
              char !== bPath[wordIndex - 1]?.text[charIndex] &&
              'link',
          ]"
          :style="{
            '--char': charIndex,
            '--strength': strengths[word.text],
          }"
        >
          {{ char }}
        </div>
        <button
          v-if="!won && wordIndex === 0 && bPath.length > 1"
          class="square right"
          title="Delete word"
          @click="bPath = bPath.slice(1)"
        >
          <X />
        </button>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue";
import { mapValues, sample } from "lodash";
import { ArrowUpDown, Check, Lightbulb, Star, X } from "lucide-vue-next";
import { data } from "@/App.vue";
import { findPath, oneLetterDifferent, type Word } from "@/data/word";
import { error } from "@/util/animate";
import { lerp } from "@/util/math";

type Props = {
  a: Word;
  b: Word;
};

const { a, b } = defineProps<Props>();

const inputElement = useTemplateRef("inputElement");

/** paths to connect */
const aPath = ref<Word[]>([]);
const bPath = ref<Word[]>([]);

/** input text */
const input = ref("");

/** update paths */
watch(
  [() => a, () => b],
  () => {
    aPath.value = [a];
    bPath.value = [b];
  },
  { immediate: true },
);

/** find shortest path between a/b */
const par = computed(() => {
  const par = findPath(a, b);
  console.log(par);
  return par;
});

/** map of word in path to distance from other end */
const strengths = computed(() => {
  const aOpposite = aPath.value.at(0)!;
  const bOpposite = bPath.value.at(-1)!;
  const getStrength = (opposite: Word) => (word: Word) =>
    [word.text, findPath(word, opposite).length] as const;
  const aStrengths = aPath.value.map(getStrength(bOpposite));
  const bStrengths = bPath.value.map(getStrength(aOpposite));
  const strengths = Object.fromEntries(aStrengths.concat(bStrengths));
  return mapValues(strengths, (value) =>
    lerp(value, par.value.length, 1, 0, 1),
  );
});

/** "submit" word to be added to path */
const submit = () => {
  if (!data.value) return;

  const { lookupWord } = data.value;
  /** full word object */
  const word = lookupWord(input.value);

  if (word) {
    /** add to path */
    if (oneLetterDifferent(word.text, aPath.value.at(-1)?.text ?? ""))
      aPath.value.push(word);
    else if (oneLetterDifferent(word.text, bPath.value.at(0)?.text ?? ""))
      bPath.value.unshift(word);
    else error(inputElement.value);
  } else error(inputElement.value);

  /** reset input */
  input.value = "";
};

/** give player random word linking to middle of path tails */
const hint = () => {
  const links = (
    aPath.value.at(-1)?.links.concat(bPath.value.at(0)?.links ?? []) ?? []
  ).filter(({ type }) => type === "regular");
  let newText = "";
  while (!newText || newText === input.value)
    newText = sample(links)?.text ?? "";
  input.value = newText;
};

/** reverse path direction */
const reverse = () => {
  const temp = aPath.value;
  aPath.value = bPath.value.reverse();
  bPath.value = temp.reverse();
};

/** win state */
const won = computed(() =>
  oneLetterDifferent(
    aPath.value.at(-1)?.text ?? "",
    bPath.value.at(0)?.text ?? "",
  ),
);
</script>

<style scoped>
.path {
  --cols: 6;
  --gap: 5px;
  display: grid;
  grid-template-columns: repeat(var(--cols), 40px);
  place-items: center;
  gap: var(--gap);
}

.char {
  --size: 40px;
  display: grid;
  z-index: 0;
  position: relative;
  grid-column: calc(var(--char) + 2);
  place-items: center;
  width: var(--size);
  height: var(--size);
  background: var(--secondary);
  color: var(--white);
  font-weight: 900;
  font-size: 1.2rem;
  text-transform: uppercase;
  filter: saturate(var(--strength));
}

.link::before {
  --w: 5px;
  --h: 10px;
  --top: calc(var(--gap) / -2 - var(--h) / 2);
  --left: calc((var(--size) - var(--w)) / 2);
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--w);
  height: var(--h);
  background: var(--secondary);
  content: "";
}

input {
  grid-column: 2 / -2;
  width: 100%;
  text-transform: uppercase;
}

input + * {
  grid-column: 2;
}

.special {
  grid-column: 1;
  color: var(--secondary);
}

.spacer {
  grid-column: 2 / -2;
  margin: 10px 0;
}
</style>
