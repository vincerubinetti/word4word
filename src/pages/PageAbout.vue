<template>
  <section>
    <h2>How To Play</h2>

    <p>
      Get from one 4-letter word to another, changing only
      <b>one letter at a time</b> and using only valid English words. Take this
      <b>par {{ example?.par.length }}</b> example between
      {{ example?.a.text.toUpperCase() }} and
      {{ example?.b.text.toUpperCase() }}:
    </p>

    <AppPath :path="example?.par ?? []" />

    <p>
      That's it! Try to connect the words in as few steps as you can. The
      <b>par</b> is the smallest # of steps possible using only
      <i>regular</i> words, so you have to be very <i>special</i> to beat it.
    </p>
  </section>

  <section>
    <h2>Dictionary</h2>

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

    <input
      v-model.trim="search"
      maxlength="4"
      pattern="[A-Za-z]"
      placeholder="Search"
    />

    <div class="table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th style="min-width: 100px"></th>
            <th colspan="3">Links</th>
          </tr>
          <tr>
            <th v-for="(col, index) in cols" :key="index">
              <button @click="sort(col.key)">
                {{ col.name }}
                <template v-if="sortKey === col.key">
                  <MoveDown v-if="sortDir === 'desc'" />
                  <MoveUp v-else />
                </template>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(word, index) in filteredDictionary.slice(
              0,
              showAll ? 9999 : limit,
            )"
            :key="index"
            :class="selected?.text === word.text && 'selected'"
            tabindex="0"
            title="See info about word"
            @click="select(word)"
            @keydown.enter="select(word)"
          >
            <td v-for="(col, index) in cols" :key="index">
              {{ word[col.key] }}
            </td>
          </tr>

          <tr v-if="filteredDictionary.length > limit">
            <td colspan="5">
              <button @click="showAll = !showAll">
                Show {{ showAll ? "Less" : "All" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="selected">
      <div ref="infoElement" class="details">
        <button
          v-if="info?.audio"
          class="square"
          title="Pronunciation"
          @click="audio.play()"
        >
          <Volume2 />
        </button>

        <b>
          {{ selected.text.toUpperCase() }}
        </b>

        <a
          :href="`https://www.google.com/search?q=define%3A+${selected.text}`"
          target="_blank"
        >
          Look up
          <ExternalLink />
        </a>
      </div>

      <div class="info" style="width: 100%">
        <span>Regular Links</span>
        <span>
          {{
            map(filter(selected.links, { type: "regular" }), "text")
              .join(", ")
              .toUpperCase()
          }}
        </span>
        <span>Special Links</span>
        <span>
          {{
            map(filter(selected.links, { type: "special" }), "text")
              .join(", ")
              .toUpperCase()
          }}
        </span>
        <span>Obscure Links</span>
        <span>
          {{
            map(filter(selected.links, { type: "obscure" }), "text")
              .join(", ")
              .toUpperCase()
          }}
        </span>
      </div>

      <div v-if="info" class="info">
        <template
          v-for="({ part, description }, index) in info.definitions"
          :key="index"
        >
          <span>{{ part }}</span>
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
    <h2>Pars</h2>

    <p>
      Certain <i>pars</i> are more common than others. Here's the distribution
      of pars between all unique pairs of <i>regular</i> words. Par ∞ means no
      possible path.
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
        # of Word Pairs
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
import { computed, ref, useTemplateRef, watchEffect } from "vue";
import { clamp, filter, map, max, orderBy, range } from "lodash";
import { ExternalLink, MoveDown, MoveUp, Volume2 } from "lucide-vue-next";
import { data } from "@/App.vue";
import { getDifficulty } from "@/components/AppPar.vue";
import AppPath from "@/components/AppPath.vue";
import { getWordInfo } from "@/data/info";
import { findPath, type Word } from "@/data/word";
import { useQuery } from "@/util/composables";
import { sleep } from "@/util/misc";

const infoElement = useTemplateRef("infoElement");

/** dictionary search */
const search = ref("");

/** dictionary, with extra derived props */
const dictionary = computed(
  () =>
    data.value?.dictionary?.map((word) => ({
      ...word,
      regularLinks: filter(word.links, { type: "regular" }).length,
      specialLinks: filter(word.links, { type: "special" }).length,
      obscureLinks: filter(word.links, { type: "obscure" }).length,
    })) ?? [],
);

/** word counts */
const total = computed(() => dictionary.value.length);
const regular = computed(
  () => filter(dictionary.value, { type: "regular" }).length,
);
const special = computed(
  () => filter(dictionary.value, { type: "special" }).length,
);
const obscure = computed(
  () => filter(dictionary.value, { type: "obscure" }).length,
);

/** example game */
const example = computed(() => {
  if (!data.value) return;

  const { lookupWord } = data.value;

  const a = lookupWord("pool")!;
  const b = lookupWord("time")!;
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
    sortDir.value = sortDir.value === "desc" ? "asc" : "desc";
  } else {
    sortKey.value = key;
    sortDir.value = "desc";
  }
};

/** table cols */
const cols: { key: keyof (typeof dictionary.value)[number]; name: string }[] = [
  { key: "text", name: "word" },
  { key: "type", name: "type" },
  { key: "regularLinks", name: "reg." },
  { key: "specialLinks", name: "spec." },
  { key: "obscureLinks", name: "obsc." },
];

/** table row limit */
const limit = 100;

/** show all table entries */
const showAll = ref(false);

/** sorted and searched dictionary */
const filteredDictionary = computed(() => {
  const _search = search.value.toLowerCase();
  return orderBy(dictionary.value, sortKey.value, sortDir.value).filter(
    (word) => word.text.includes(_search),
  );
});

/** selected word */
const selected = ref<Word>();

/** select word */
const select = async (word: Word) => {
  if (selected.value === word) selected.value = undefined;
  else {
    selected.value = word;
    await sleep();
    infoElement.value?.scrollIntoView({ block: "center", behavior: "smooth" });
  }
};

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

  /** get max y value */
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
  grid-template-columns: repeat(4, auto);
  place-items: center;
  gap: 5px;
}

input {
  text-transform: uppercase;
}

.table {
  max-width: 100%;
  max-height: calc(10 * (1lh + 10px));
  overflow-x: auto;
  overflow-y: auto;
}

table {
  border-collapse: collapse;
  background: var(--off-white);
  text-align: center;
  text-transform: uppercase;
}

table button {
  min-height: 0;
  padding: 5px 15px;
  gap: 0;
  border-radius: 0;
  background: none;
  text-transform: uppercase;
}

thead tr {
  position: sticky;
  top: 0;
  background: var(--light-gray);
}

th button {
  position: relative;
  min-width: unset;
}

th button svg {
  position: absolute;
  right: 0;
}

tbody tr {
  cursor: pointer;
}

tbody tr:hover {
  background: var(--light-gray);
}

td {
  padding: 5px 10px;
}

.selected {
  font-weight: var(--bold);
}

.details {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.info {
  display: grid;
  grid-template-columns: max-content 1fr;
  justify-items: flex-start;
  gap: 10px 20px;
  text-align: left;
}

.info > :nth-child(odd) {
  font-weight: var(--bold);
}

.info > :empty {
  content: "-";
  color: var(--gray);
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
