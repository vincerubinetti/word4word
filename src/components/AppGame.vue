<template>
  <section>
    <div class="buttons">
      <AppPar
        component="button"
        :par="par.length"
        :class="showPar && 'active'"
        @click="showPar = true"
      >
        <LandPlot />
      </AppPar>

      <button
        :class="!showPar && 'active'"
        v-tooltip="'Your path'"
        @click="showPar = false"
      >
        <User />
        <span>Yours: {{ steps }}</span>
      </button>
    </div>

    <AppPath
      v-if="showPar"
      :class="won ? 'wiggle-always' : 'flip'"
      :path="
        par.length
          ? aPath.at(0)?.text === b.text && bPath.at(-1)?.text === a.text
            ? par.toReversed()
            : par
          : [
              aPath.at(0)!,
              { text: '????', type: 'special', links: [] },
              bPath.at(-1)!,
            ]
      "
      :hide="!won"
    />

    <div v-else class="grid">
      <div
        v-for="(word, wordIndex) in aPath"
        :key="word.text"
        class="row"
        :style="{ '--dist': dists.a[word.text] }"
      >
        <Star
          v-if="word.type === 'special'"
          class="special"
          tabindex="0"
          v-tooltip="'Special word'"
        />
        <AppChar
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :link="getDiff(char, 'a', wordIndex, charIndex)"
          :class="won ? 'wiggle-always' : 'flip'"
          :style="{
            '--col': charIndex,
            '--delay': (won ? wordIndex * 0.2 : 0) + charIndex * 0.1 + 's',
          }"
        >
          {{ char }}
        </AppChar>
        <button
          v-if="!won && wordIndex === aPath.length - 1 && aPath.length > 1"
          class="secondary square"
          v-tooltip="'Remove word'"
          @click="remove('a')"
        >
          <X />
        </button>
      </div>

      <template v-if="!won">
        <div class="spacer" />

        <div class="row">
          <AppInput
            ref="inputElement"
            v-model="input"
            class="input"
            placeholder="Word"
            @keydown.enter.prevent="submit"
            @keydown="shortcuts"
          />

          <Transition name="slide" mode="out-in">
            <aside v-if="message" class="message" aria-live="polite">
              {{ message }}
            </aside>
          </Transition>

          <button
            class="hint secondary square"
            v-tooltip="'Get hint'"
            @click.prevent="hint"
          >
            <Lightbulb />
          </button>

          <button
            v-if="input.length > 0"
            class="clear secondary square"
            v-tooltip="'Clear input'"
            @click="clear"
          >
            <X />
          </button>

          <button
            v-if="inputWord && (aDiff || bDiff)"
            class="submit secondary square pulse"
            v-tooltip="'Add word'"
            @click="submit"
          >
            <MoveVertical v-if="aDiff && bDiff" />
            <ArrowUp v-else-if="aDiff" />
            <ArrowDown v-else-if="bDiff" />
          </button>

          <button
            class="reverse secondary square"
            v-tooltip="'Reverse path'"
            @click.prevent="reverse"
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
        :style="{ '--dist': dists.b[word.text] }"
      >
        <Star
          v-if="word.type === 'special'"
          class="special"
          tabindex="0"
          v-tooltip="'Special word'"
        />
        <AppChar
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :link="getDiff(char, 'b', wordIndex, charIndex)"
          :class="won ? 'wiggle-always' : 'flip'"
          :style="{
            '--col': charIndex,
            '--delay':
              (won ? (aPath.length + wordIndex) * 0.2 : 0) +
              charIndex * 0.1 +
              's',
          }"
        >
          {{ char }}
        </AppChar>
        <button
          v-if="!won && wordIndex === 0 && bPath.length > 1"
          class="secondary square"
          v-tooltip="'Remove word'"
          @click="remove('b')"
        >
          <X />
        </button>
      </div>
    </div>

    <div class="buttons">
      <button
        class="secondary square"
        v-tooltip="'Reset game'"
        @click="resetGame"
      >
        <RefreshCcw />
      </button>
      <button
        :class="won ? 'primary' : 'secondary square'"
        v-tooltip="'Share game'"
        @click="share"
      >
        <Share />
        <template v-if="won">Share</template>
      </button>
    </div>
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
  RefreshCcw,
  Share,
  Star,
  User,
  X,
} from "lucide-vue-next";
import { useIntervalFn } from "@vueuse/core";
import AppChar from "@/components/AppChar.vue";
import AppInput from "@/components/AppInput.vue";
import AppPar from "@/components/AppPar.vue";
import AppPath from "@/components/AppPath.vue";
import { data } from "@/data";
import { sleep } from "@/util/misc";
import { savedGames } from "@/util/storage";
import { findPath, oneLetterDifferent, type Word } from "@/word";

const { VITE_TITLE } = import.meta.env;

type Props = {
  /** start word */
  a: Word;
  /** end word */
  b: Word;
};

const { a, b } = defineProps<Props>();

/** storage key */
const key = computed(() => a.text + "-" + b.text);

/** word paths to connect */
const aPath = ref<Word[]>([]);
const bPath = ref<Word[]>([]);

/** look up words from text, when ready */
const lookup = computed(() => {
  if (!data.value) return () => undefined;
  const { lookupWord } = data.value;
  return (words: string[]) => {
    /** map text words to full word objects */
    const lookups = words.map(lookupWord);
    const filtered = lookups.filter((w) => w !== undefined);
    /** error if any words can't be found in dict */
    if (filtered.length !== lookups.length) {
      console.error("Couldn't look up word from storage");
      return;
    }
    return filtered;
  };
});

/** load game */
const loadGame = () => {
  const loaded = savedGames.value[key.value];
  if (loaded) {
    /** load from storage */
    aPath.value = lookup.value(loaded.a) ?? [a];
    bPath.value = lookup.value(loaded.b) ?? [b];
  } else {
    /** new game */
    aPath.value = [a];
    bPath.value = [b];
  }
};
watch([() => a, () => b, key, lookup], loadGame, { immediate: true });

/** save game */
const saveGame = () => {
  /** save to storage */
  savedGames.value[key.value] = {
    a: map(aPath.value, "text"),
    b: map(bPath.value, "text"),
    won: won.value,
  };
};

/** reset game */
const resetGame = () => {
  if (window.confirm("Start over?")) {
    delete savedGames.value[key.value];
    loadGame();
  }
};

/** input dom element */
const inputElement = useTemplateRef("inputElement");

/** input text */
const input = ref("");

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
watchEffect(() => input.value.length === 4 && check());

/** clear input */
const clear = () => (input.value = "");

/** which path was last added to */
let lastAdded: ("a" | "b")[] = [];

/** submit word to be added to path */
const submit = async () => {
  if (check()) {
    const word = inputWord.value!;
    /** add word to path */
    if (aDiff.value) {
      aPath.value.push(word);
      lastAdded.push("a");
      saveGame();
    } else if (bDiff.value) {
      bPath.value.unshift(word);
      lastAdded.push("b");
      saveGame();
    }
  }

  /** reset input */
  input.value = "";
  await sleep(100);
  inputElement.value?.element?.scrollIntoView({
    block: "nearest",
    behavior: "smooth",
  });
};

/** remove word from path */
const remove = (path: "a" | "b") => {
  if (path === "a" && aPath.value.length > 1) {
    aPath.value = aPath.value.slice(0, -1);
    saveGame();
  }
  if (path === "b" && bPath.value.length > 1) {
    bPath.value = bPath.value.slice(1);
    saveGame();
  }
};

/** remove last added word */
const removeLast = () => {
  const last = lastAdded.pop();
  if (last) remove(last);
};

/** message text */
const message = ref("");

/** show message */
const setMessage = (text: string) => {
  message.value = text;
  hideMessage();
};

/** hide message */
const hideMessage = debounce(() => (message.value = ""), 1500);

/** find shortest path between a/b */
const par = computed(() => findPath(a, b));

/** length of players path */
const steps = computed(() => aPath.value.length + bPath.value.length);

/** map of word in path to distance from end of opposite path */
const dists = computed(() => {
  /** get distances for one of the paths */
  const getDist = (path: Word[], opposite: Word, invert: boolean) =>
    /** make into lookup */
    Object.fromEntries(
      path.map((word) => {
        /** find dist in # of steps */
        let dist = findPath(word, opposite).length;
        /** find max */
        const max = par.value.length;
        /** if no path */
        if (!dist || !max) return [word.text, invert ? 0 : 1];
        /** normalize to 0-1 */
        dist = dist / max;
        /** flip */
        if (invert) dist = 1 - dist;
        return [word.text, dist];
      }),
    );

  return {
    a: getDist(aPath.value, bPath.value.at(-1)!, true),
    b: getDist(bPath.value, aPath.value.at(0)!, false),
  };
});

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
  lastAdded = lastAdded.map((list) => (list === "a" ? "b" : "a"));
  if (aPath.value.length > 1 || bPath.value.length > 1) saveGame();
};

/** keyboard shortcuts on input */
const shortcuts = (event: KeyboardEvent) => {
  if (event.ctrlKey) {
    if (event.key === "r") {
      event.preventDefault();
      removeLast();
    }
    if (event.key === "h") {
      event.preventDefault();
      hint();
    }
    if (event.key === "c") {
      event.preventDefault();
      clear();
    }
  }
};

/** whether this char should be linked to char below in path */
const getDiff = (
  text: string,
  which: "a" | "b",
  wordIndex: number,
  charIndex: number,
) => {
  const word =
    which === "a"
      ? aPath.value[wordIndex + 1] ||
        (won.value ? bPath.value.at(0) : undefined)
      : bPath.value[wordIndex + 1];
  const char = word?.text?.[charIndex] ?? "";
  return !!char && text !== char;
};

/** share game */
const share = async () => {
  try {
    await window.navigator.share({
      url: window.location.href,
      text: [
        VITE_TITLE,
        `${a.text} ↔ ${b.text}`,
        `Par: ${par.value.length || "???"}`,
        won.value ? `Mine: ${steps.value}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error) {
    console.error(error);
  }
};

/** win state */
const won = computed(() =>
  oneLetterDifferent(
    aPath.value.at(-1)?.text ?? "",
    bPath.value.at(0)?.text ?? "",
  ),
);

/** should show perfect par path */
const showPar = ref(false);

/** did player get a perfect par */
const perfect = computed(() => won.value && steps.value <= par.value.length);

/** max particles at a time */
const maxParticles = 20;
/** size range of particle */
const minSize = 5;
const maxSize = 15;

/** confetti */
const { pause, resume } = useIntervalFn(
  () => {
    if (document.querySelectorAll(".particle").length > maxParticles) return;
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = random(minSize, maxSize);
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    let x = halfW;
    let y = halfH;
    x += random(-1, 1, true) * (halfW - maxSize);
    y += random(-1, 1, true) * (halfH - maxSize);
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
</script>

<style scoped>
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 40px);
  place-items: center;
  gap: 5px;
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

:deep(.input) {
  grid-column: 2 / 6;
  width: 100%;
}

.message,
.hint,
.clear,
:deep(.input),
.submit,
.reverse {
  grid-row: 1;
}

.hint {
  grid-column: 1;
}

.clear {
  grid-column: 2;
  background: none !important;
}

.submit {
  grid-column: 5;
  background: none !important;
}

.reverse {
  grid-column: 6;
}

.special {
  grid-column: 1;
  color: var(--gray);
  fill: currentColor;
}
</style>
