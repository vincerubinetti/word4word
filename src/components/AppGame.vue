<template>
  <section>
    <div class="info">
      <button
        :class="won && showPar && 'secondary'"
        :disabled="!won"
        @click="showPar = true"
      >
        <LandPlot />
        <template v-if="won">
          <span>Par</span>
          <b>{{ par.length }}</b>
        </template>
        <AppPar v-else :par="par.length" />
      </button>

      <button
        :class="won && !showPar && 'secondary'"
        :disabled="!won"
        @click="showPar = false"
      >
        <User />
        <span>Yours</span>
        <b>{{ steps }}</b>
      </button>
    </div>

    <AppPath v-if="won && showPar" :path="par" />

    <div v-else class="grid">
      <div
        v-for="(word, wordIndex) in aPath"
        :key="word.text"
        class="row"
        :style="{ '--dist': dists[word.text] }"
      >
        <Star v-if="word.type === 'special'" class="special filled" />
        <AppChar
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :class="[
            won ? 'wiggle-always' : 'flip',
            getDiff(char, 'a', wordIndex, charIndex) && 'highlight',
          ]"
          :style="{
            '--col': charIndex,
            '--delay': (won ? wordIndex * 0.4 : 0) + charIndex * 0.1 + 's',
          }"
        >
          {{ char }}
        </AppChar>
        <button
          v-if="!won && wordIndex === aPath.length - 1 && aPath.length > 1"
          class="square"
          v-tooltip="'Delete word'"
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
            v-model.trim="input"
            class="input"
            maxlength="4"
            pattern="[A-Za-z]"
            placeholder="WORD"
            @keydown.enter="add"
          />

          <Transition name="slide" mode="out-in">
            <aside v-if="message" class="message" aria-live="polite">
              {{ message }}
            </aside>
          </Transition>

          <button class="hint square" v-tooltip="'Get hint'" @click="hint">
            <Lightbulb />
          </button>

          <button
            v-if="input.length > 0"
            class="clear square"
            v-tooltip="'Clear input'"
            @click="input = ''"
          >
            <X />
          </button>

          <button
            v-if="inputWord && (aDiff || bDiff)"
            class="add square pulse"
            v-tooltip="'Add word'"
            @click="add"
          >
            <MoveVertical v-if="aDiff && bDiff" />
            <ArrowUp v-else-if="aDiff" />
            <ArrowDown v-else-if="bDiff" />
          </button>

          <button
            class="reverse square"
            v-tooltip="'Reverse path'"
            @click="reverse"
          >
            <ArrowUpDown />
          </button>
        </div>

        <div class="spacer" />
      </template>

      <div
        v-for="(word, wordIndex) in bPath"
        :key="word.text"
        class="row"
        :style="{ '--dist': dists[word.text] }"
      >
        <Star v-if="word.type === 'special'" class="special filled" />
        <AppChar
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :class="[
            won ? 'wiggle-always' : 'flip',
            getDiff(char, 'b', wordIndex, charIndex) && 'highlight',
          ]"
          :style="{
            '--col': charIndex,
            '--delay':
              (won ? (aPath.length + wordIndex) * 0.4 : 0) +
              charIndex * 0.1 +
              's',
          }"
        >
          {{ char }}
        </AppChar>
        <button
          v-if="!won && wordIndex === 0 && bPath.length > 1"
          class="square"
          v-tooltip="'Delete word'"
          @click="bPath = bPath.slice(1)"
        >
          <X />
        </button>
      </div>
    </div>

    <button :class="won ? 'primary' : 'secondary'" @click="share">
      <Share />Share
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, watchEffect } from "vue";
import { debounce, filter, map, random, sample } from "lodash";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  LandPlot,
  Lightbulb,
  MoveVertical,
  Share,
  Star,
  User,
  X,
} from "lucide-vue-next";
import { useIntervalFn } from "@vueuse/core";
import { data } from "@/App.vue";
import AppChar from "@/components/AppChar.vue";
import AppPar from "@/components/AppPar.vue";
import { findPath, oneLetterDifferent, type Word } from "@/data/word";
import { lerp } from "@/util/math";
import { sleep, storage } from "@/util/misc";
import AppPath from "./AppPath.vue";

const { VITE_TITLE } = import.meta.env;

type Props = {
  a: Word;
  b: Word;
};

const { a, b } = defineProps<Props>();

const inputElement = useTemplateRef("inputElement");

/** storage key */
const key = computed(() => a.text + "-" + b.text);

/** word paths to connect */
const aPath = ref<Word[]>([]);
const bPath = ref<Word[]>([]);

/** typed storage interface */
const { load, save } = storage<{ a: string[]; b: string[] }>();

/** look up words from text, when ready */
const lookup = computed(() => {
  if (!data.value) return () => [];
  const { lookupWord } = data.value;
  return (words: string[]) => {
    const lookups = words.map(lookupWord);
    const filtered = lookups.filter((w) => w !== undefined);
    if (filtered.length !== lookups.length)
      throw Error("Couldn't look up word from storage");
    return filtered;
  };
});

/** load from storage */
watchEffect(
  () => {
    const loaded = load(key.value);
    if (!loaded) return;
    const { a, b } = loaded;
    aPath.value = lookup.value(a);
    bPath.value = lookup.value(b);
  },
  { flush: "post" },
);

/** save to storage */
watchEffect(
  () => {
    if (!data.value) return;
    save(key.value, {
      a: map(aPath.value, "text"),
      b: map(bPath.value, "text"),
    });
  },
  { flush: "post" },
);

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

/** length of players path */
const steps = computed(() => aPath.value.length + bPath.value.length);

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

/** auto-check when player has typed all letters */
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
  inputElement.value?.scrollIntoView({ block: "nearest", behavior: "smooth" });
};

/** whether this char should be linked to char above in path */
const getDiff = (
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
  const links = filter(
    aPath.value.at(-1)?.links.concat(bPath.value.at(0)?.links ?? []) ?? [],
    { type: "regular" },
  );
  const newText = sample(links)?.text ?? "";
  if (input.value === newText && links.length > 2) hint();
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

/** did player get a perfect par */
const perfect = computed(() => won.value && steps.value <= par.value.length);

/** max particles at a time */
const maxParticles = 10;

/** confetti */
const { pause, resume } = useIntervalFn(
  () => {
    if (document.querySelectorAll(".particle").length > maxParticles) return;
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = random(3, 12);
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    let x = halfW;
    let y = halfH;
    x += random(-1, 1, true) * (halfW - 100);
    y += random(-1, 1, true) * (halfH - 100);
    particle.style.setProperty("--size", size + "px");
    particle.style.setProperty("--x", x + "px");
    particle.style.setProperty("--y", y + "px");
    document.body.append(particle);
    particle.addEventListener("animationend", particle.remove);
  },
  1000 / maxParticles,
  { immediate: false },
);
watchEffect(() => (won.value && perfect.value ? resume() : pause()));

/** should show perfect par path */
const showPar = ref(false);

/** share results */
const share = async () => {
  try {
    await window.navigator.share({
      url: window.location.href,
      text: [
        VITE_TITLE,
        `${a.text} ↔ ${b.text}`,
        `Par: ${par.value.length}`,
        won.value ? `Mine: ${steps.value}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

[disabled] {
  background: none;
  color: unset;
  filter: none;
  opacity: 1;
}

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
  font-weight: var(--bold);
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
  color: var(--special);
}
</style>
