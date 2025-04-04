<template>
  <section>
    <h2>How To Play</h2>

    <p>
      Get from one 4-letter word to another, changing only
      <b>one letter at a time</b> and only using valid English words. Take this
      <b>par {{ example?.par.length }}</b> example between
      {{ example?.a.text.toUpperCase() }} and
      {{ example?.b.text.toUpperCase() }}:
    </p>

    <div class="grid">
      <template v-for="(word, wordIndex) in example?.par" :key="wordIndex">
        <component
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :is="
            example?.par[wordIndex - 1]?.text[charIndex] !== char ||
            wordIndex === (example?.par.length ?? 0) - 1
              ? 'b'
              : 'span'
          "
          >{{ char.toUpperCase() }}</component
        >
      </template>
    </div>

    <p>
      That's it! Try to connect the words in as few steps as you can. The
      <b>par</b> is the smallest amount of steps possible using only
      <i>regular</i> words, so you have to be very <i>special</i> to beat it.
    </p>
  </section>

  <section>
    <h2>Dictionary</h2>

    <input v-model.trim="search" maxlength="4" placeholder="Search" />

    <div class="table">
      <table>
        <thead>
          <tr>
            <th>
              <button @click="sort('text')">
                WORD
                <template v-if="sortKey === 'text'">
                  <MoveDown v-if="sortDir === 'desc'" />
                  <MoveUp v-else />
                </template>
              </button>
            </th>
            <th>
              <button @click="sort('type')">
                TYPE
                <template v-if="sortKey === 'type'">
                  <MoveDown v-if="sortDir === 'desc'" />
                  <MoveUp v-else />
                </template>
              </button>
            </th>
            <th>
              <button @click="sort('links.length')">
                LINKS
                <template v-if="sortKey === 'links.length'">
                  <MoveDown v-if="sortDir === 'desc'" />
                  <MoveUp v-else />
                </template>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(word, index) in filteredDictionary" :key="index">
            <td>
              <button @click="select(word)">
                {{ word.text }}
              </button>
            </td>
            <td>{{ word.type }}</td>
            <td>{{ word.links.length.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="selected">
      <div class="flex-row">
        {{ selected.text.toUpperCase() }}
        <a
          :href="`https://www.google.com/search?q=define%3A+${selected.text}`"
          target="_blank"
          >Look up<ExternalLink
        /></a>

        <button
          v-if="info?.audio"
          class="square"
          title="Pronunciation"
          @click="audio.play()"
        >
          <Volume2 />
        </button>
      </div>

      <div v-if="info" class="info">
        <template
          v-for="({ part, description }, index) in info.definitions"
          :key="index"
        >
          <b>{{ part }}</b>
          <span>{{ description }}</span>
        </template>
      </div>

      <div v-if="status === 'loading'" class="gray">
        Looking for definitions
      </div>
      <div v-if="status === 'error'" class="gray">
        Couldn't find definitions automatically
      </div>
    </template>
  </section>

  <section>
    <h2>Fun Facts</h2>

    <p>
      This game has a total of
      <b>{{ total.toLocaleString() }}</b> 4-letter words:
    </p>

    <p style="padding-left: 40px">
      <b>{{ regular.toLocaleString() }}</b> <i>regular</i> words, very commonly
      known and used<br />
      <b>{{ special.toLocaleString() }}</b> <i>special</i> words, known but not
      used every day or misc.<br />
      <b>{{ obscure.toLocaleString() }}</b> <i>obscure</i> words, rarely known
      or used
    </p>

    <p>
      <i>Regular</i> words are used to find the par. <i>Special</i> words can
      still be played. <i>Obscure</i> words are not allowed at all.
    </p>

    <p>
      Certain <i>pars</i> are more common than others. Here's the distribution:
    </p>

    <svg
      v-if="data?.pars"
      :viewBox="
        [
          -chartPadding,
          -chartHeight - chartPadding,
          chartWidth + 2 * chartPadding,
          chartHeight + 2 * chartPadding,
        ].join(' ')
      "
      class="chart"
    >
      <path
        v-for="({ par, x, y, yLabel }, index) in chartData.data"
        :key="index"
        class="bar"
        :d="['M', x, 0, 'v', -y].join(' ')"
        :title="yLabel"
        :stroke="getDifficulty(par).color"
      />

      <path
        class="axes"
        :d="['M', 0, -chartHeight, 'v', chartHeight, 'h', chartWidth].join(' ')"
      />

      <text class="x-axis" :x="chartWidth / 2" y="0">Par</text>

      <text
        class="y-axis"
        :transform="`translate(0, ${-chartHeight / 2}) rotate(-90)`"
      >
        # of Pairs
      </text>

      <text
        v-for="({ x, text }, index) in chartData.xLabels"
        :key="index"
        class="x-label"
        :x="x"
        y="0"
      >
        {{ text }}
      </text>

      <text
        v-for="({ y, text }, index) in chartData.yLabels"
        :key="index"
        class="y-label"
        :y="-y"
        x="0"
      >
        {{ text }}
      </text>
    </svg>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { clamp, max, orderBy, range } from "lodash";
import { ExternalLink, MoveDown, MoveUp, Volume2 } from "lucide-vue-next";
import { data } from "@/App.vue";
import { getDifficulty } from "@/components/AppPar.vue";
import { getWordInfo } from "@/data/definitions";
import { findPath, type Word } from "@/data/word";
import { useQuery } from "@/util/composables";

/** dictionary search */
const search = ref("");

/** dictionary */
const dictionary = computed(() => data.value?.dictionary ?? []);

/** word counts */
const total = computed(() => dictionary.value.length);
const regular = computed(
  () => dictionary.value.filter(({ type }) => type === "regular").length,
);
const special = computed(
  () => dictionary.value.filter(({ type }) => type === "special").length,
);
const obscure = computed(
  () => dictionary.value.filter(({ type }) => type === "obscure").length,
);

/** example game */
const example = computed(() => {
  if (!data.value) return;

  const { lookupWord } = data.value;

  const a = lookupWord("pool")!;
  const b = lookupWord("bush")!;
  const par = findPath(a, b);

  return { a, b, par };
});

/** sort state */
const sortKey = ref("text");
const sortDir = ref<"asc" | "desc">("asc");

/** switch sort */
const sort = (key: string) => {
  if (sortKey.value === key) {
    sortKey.value = key;
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
};

/** sorted and searched dictionary */
const filteredDictionary = computed(() => {
  const _search = search.value.toLowerCase();
  return orderBy(dictionary.value, sortKey.value, sortDir.value)
    .filter((word) => word.text.includes(_search))
    .slice(0, 9999);
});

/** selected word */
const selected = ref<Word>();

/** select word */
const select = (word: Word) =>
  (selected.value = selected.value === word ? undefined : word);

/** lookup info for selected word */
const { data: info, status, run } = useQuery(getWordInfo);

/** search for word info when selected changes */
watchEffect(() => selected.value && run(selected.value.text));

/** audio player */
const audio = ref(new Audio(""));
watchEffect(() => (audio.value.src = info.value?.audio ?? ""));

/** chart settings */
const chartWidth = 200;
const chartHeight = 100;
const chartPadding = 20;

/** chart coordinates */
const chartData = computed(() => {
  if (!data.value) return {};
  const { pars } = data.value;

  /** get max value */
  const maxPairs = max(pars.map((par) => par?.length ?? 0)) ?? 0;

  /** non linear */
  const power = 3;

  /** normalize value */
  const normalize = (value: number) =>
    clamp((value / maxPairs) ** (1 / power), 0.01, 1);

  /** transform ranges */
  const scaleX = (index: number, length: number) =>
    chartWidth * ((0.5 + index) / length);
  const scaleY = (value: number) => chartHeight * normalize(value);

  /** bar item for each par */
  const bars = pars
    .map((pairs, index) =>
      pairs
        ? {
            par: index,
            value: pairs.length,
            /** if 64 (max 8-bit int), par is infinity (i.e. no possible path) */
            xLabel: index === 64 ? "∞" : index,
            yLabel: pairs.length.toLocaleString(),
          }
        : undefined,
    )
    .filter((par) => par !== undefined);

  return {
    /** x-axis labels */
    xLabels: bars.map((bar, index, array) => ({
      x: scaleX(index, array.length),
      text: bar.xLabel,
    })),
    /** y-axis labels */
    yLabels: range(0, 1, 1 / 4)
      .concat([1])
      .map((value) => value ** power * maxPairs)
      .map((value) => ({
        y: scaleY(value),
        text: value.toLocaleString(undefined, { notation: "compact" }),
      })),
    /** bar data */
    data: bars.map((item, index, array) => ({
      ...item,
      x: scaleX(index, array.length),
      y: scaleY(item.value),
    })),
  };
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1em);
  place-items: center;
}

input {
  text-transform: uppercase;
}

.table {
  max-width: 100%;
  max-height: calc(10 * (1lh + 10px));
  overflow-x: auto;
  overflow-y: auto;
  background: var(--off-white);
  text-align: center;
}

table {
  border-collapse: collapse;
}

table button {
  min-height: 0;
  padding: 5px 10px;
  gap: 0;
  border-radius: 0;
  background: none;
}

table button svg {
}

thead tr {
  position: sticky;
  top: 0;
  background: var(--light-gray);
}

th {
  width: 100px;
}

td {
  padding: 5px 10px;
}

td:first-child {
  padding: 0;
}

td:first-child button {
  text-transform: uppercase;
}

.info {
  display: grid;
  grid-template-columns: auto auto;
  justify-items: flex-start;
  gap: 10px 20px;
  text-align: left;
}

.chart {
  overflow: visible;
}

.chart text {
  fill: var(--black);
  font-size: 6px;
}

.axes {
  fill: none;
  stroke: var(--black);
}

.bar {
  fill: none;
  stroke-width: 6px;
}

.x-axis {
  dominant-baseline: hanging;
  text-anchor: middle;
  translate: 0 2em;
}

.y-axis {
  dominant-baseline: central;
  text-anchor: middle;
  translate: -3.5em 0;
}

.x-label {
  dominant-baseline: hanging;
  text-anchor: middle;
  translate: 0 0.5em;
}

.y-label {
  dominant-baseline: central;
  text-anchor: end;
  translate: -0.5em 0;
}
</style>
