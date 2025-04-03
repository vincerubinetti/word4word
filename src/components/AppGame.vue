<template>
  <section>
    <div class="flex-row">
      <div>Par: {{ par.length }}</div>
      <div>Yours: {{ aPath.length + bPath.length }}</div>
    </div>

    <div class="grid">
      <div
        v-for="(word, wordIndex) in aPath"
        :key="word.text"
        class="row"
        :style="{
          '--dist': dists[word.text],
        }"
      >
        <Star v-if="word.type === 'special'" class="special filled" />
        <div
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :class="[
            'char',
            getLink(char, 'a', wordIndex, charIndex) && 'link',
            won && 'wiggle-always',
          ]"
          :style="{
            '--col': charIndex,
            '--delay': wordIndex * 0.4 + charIndex * 0.1 + 's',
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
      </div>

      <template v-if="!won">
        <div class="spacer" />

        <div class="row">
          <input
            ref="inputElement"
            v-model="input"
            class="input"
            maxlength="4"
            placeholder="WORD"
            @keydown.enter="add"
          />

          <Transition name="slide" mode="out-in">
            <aside v-if="message" class="message" aria-live="polite">
              {{ message }}
            </aside>
          </Transition>

          <button class="hint square" title="Get hint" @click="hint">
            <Lightbulb />
          </button>

          <button
            v-if="input.length > 0"
            class="clear square"
            title="Clear input"
            @click="input = ''"
          >
            <X />
          </button>

          <button
            v-if="inputWord && (aDiff || bDiff)"
            class="add square pulse"
            title="Add word"
            @click="add"
          >
            <MoveVertical v-if="aDiff && bDiff" />
            <ArrowUp v-else-if="aDiff" />
            <ArrowDown v-else-if="bDiff" />
          </button>

          <button class="reverse square" title="Reverse path" @click="reverse">
            <ArrowUpDown />
          </button>
        </div>

        <div class="spacer" />
      </template>

      <div
        v-for="(word, wordIndex) in bPath"
        :key="word.text"
        class="row"
        :style="{
          '--dist': dists[word.text],
        }"
      >
        <Star v-if="word.type === 'special'" class="special filled" />
        <div
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :class="[
            'char',
            getLink(char, 'b', wordIndex, charIndex) && 'link',
            won && 'wiggle-always',
          ]"
          :style="{
            '--col': charIndex,
            '--delay': (aPath.length + wordIndex) * 0.4 + charIndex * 0.1 + 's',
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, watchEffect } from "vue";
import { debounce, sample } from "lodash";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Lightbulb,
  MoveVertical,
  Star,
  X,
} from "lucide-vue-next";
import { data } from "@/App.vue";
import { findPath, oneLetterDifferent, type Word } from "@/data/word";
import { lerp } from "@/util/math";
import { sleep } from "@/util/misc";

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

/** message text */
const message = ref("");

/** show message */
const setMessage = (text: string) => {
  message.value = text;
  hideMessage();
};

/** hide message */
const hideMessage = debounce(() => (message.value = ""), 1500);

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
const par = computed(() => findPath(a, b));

/** map of word in path to distance from other end */
const dists = computed(() => {
  const aOpposite = aPath.value.at(0)!;
  const bOpposite = bPath.value.at(-1)!;
  const getDist =
    (opposite: Word, min = 0, max = 1) =>
    (word: Word) => {
      let dist = findPath(word, opposite).length;
      dist = lerp(dist, par.value.length, 1, min, max);
      return [word.text, dist] as const;
    };
  const aDists = aPath.value.map(getDist(bOpposite, 0, 1));
  const bDists = bPath.value.map(getDist(aOpposite, 1, 0));
  return Object.fromEntries(aDists.concat(bDists));
});

/** full input word object, undef if invalid word */
const inputWord = computed(() => {
  if (!data.value) return;
  const { lookupWord } = data.value;
  return lookupWord(input.value);
});

/** is input word 1 letter diff from end of path a */
const aDiff = computed(() =>
  oneLetterDifferent(input.value, aPath.value.at(-1)?.text ?? ""),
);

/** is input word 1 letter diff from end of path b */
const bDiff = computed(() =>
  oneLetterDifferent(input.value, bPath.value.at(0)?.text ?? ""),
);

/** check if word can be added to path */
const check = () => {
  if (!inputWord.value) {
    setMessage("Not a valid word");
    return false;
  }
  if (!aDiff.value && !bDiff.value) {
    setMessage("Not 1 letter different");
    return false;
  }
  return true;
};

watchEffect(() => {
  if (input.value.length === 4) check();
});

/** "submit" word to be added to path */
const add = async () => {
  if (check()) {
    const word = inputWord.value!;
    if (aDiff.value) aPath.value.push(word);
    else if (bDiff.value) bPath.value.unshift(word);
  }

  input.value = "";
  await sleep(100);
  inputElement.value?.scrollIntoView({ block: "center", behavior: "smooth" });
};

/** whether this char should be linked to char above in path */
const getLink = (
  char: string,
  which: "a" | "b",
  wordIndex: number,
  charIndex: number,
) => {
  const wordAbove =
    which === "a"
      ? aPath.value[wordIndex - 1]
      : bPath.value[wordIndex - 1] ||
        (won.value ? aPath.value.at(-1) : undefined);
  const charAbove = wordAbove?.text?.[charIndex] ?? "";
  return charAbove && char !== charAbove;
};

/** give player random word linking to middle of path tails */
const hint = () => {
  const links = (
    aPath.value.at(-1)?.links.concat(bPath.value.at(0)?.links ?? []) ?? []
  ).filter(({ type }) => type === "regular");
  const newText = sample(links)?.text ?? "";
  if (input.value === newText) hint();
  else input.value = newText;
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
.grid {
  --gap: 5px;
  display: grid;
  grid-template-columns: repeat(6, 40px);
  place-items: center;
  gap: var(--gap);
}

.row {
  display: grid;
  position: relative;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  place-items: center;
}

.char {
  --size: 40px;
  --color: color-mix(
    in lch,
    var(--primary),
    var(--secondary) calc(100% * var(--dist))
  );
  display: grid;
  position: relative;
  grid-column: calc(var(--col) + 2);
  place-items: center;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  color: var(--white);
  font-weight: 900;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.link::before {
  --w: 5px;
  --h: 5px;
  --top: calc(var(--gap) / -2 - var(--h) / 2);
  --left: calc((var(--size) - var(--w)) / 2);
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--w);
  height: var(--h);
  background: var(--color);
  content: "";
}

.spacer {
  grid-column: 1 / -1;
  width: 100%;
  height: 10px;
}

.message {
  z-index: 1;
  position: absolute;
  bottom: calc(100% + 10px);
  padding: 5px 10px;
  background: var(--black);
  color: var(--white);
}

.input {
  grid-column: 2 / 6;
  width: 100%;
  font-weight: 600;
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  text-transform: uppercase;
}

.message,
.hint,
.clear,
.input,
.add,
.reverse {
  grid-row: 1;
}

.clear,
.add {
  background: none;
}

.hint {
  grid-column: 1;
}

.clear {
  grid-column: 2;
}

.add {
  grid-column: 5;
}

.reverse {
  grid-column: 6;
}

.special {
  grid-column: 1;
  color: var(--dark-gray);
}
</style>
