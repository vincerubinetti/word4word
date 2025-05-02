<template>
  <section>
    <h2><BowArrow class="gray" />How To Play</h2>

    <p>
      Get from one 4-letter word to another, changing
      <b>one letter at a time</b> and only using valid English words. Take this
      <b>par {{ example?.par.length }}</b> example from
      {{ example?.a.text.toUpperCase() }} to
      {{ example?.b.text.toUpperCase() }}:
    </p>

    <AppPath class="flip" :path="example?.par ?? []" />

    <p>
      That's it! Try to connect the words in as few steps as possible. The
      <b>par</b> is the smallest # of steps possible if you use only
      <b>regular</b> words. Consider it a perfect score. Even matching it is an
      achievement (and you'd have to be very <b>special</b> to <i>beat</i> it).
    </p>
  </section>

  <section>
    <h2><BookA class="gray" />Dictionary</h2>

    <p>
      The game knows a total of
      <b>{{ total.toLocaleString() }}</b> 4-letter words:
    </p>

    <ul>
      <li>
        <b>{{ regular.toLocaleString() }}</b> <b>regular</b> words
        <br />
        Common, basic.
        <br />
        Used to calculate par and pick daily game words.
      </li>
      <li>
        <b>{{ special.toLocaleString() }}</b> <b>special</b> words
        <br />
        Less common, proper nouns, borrowed, slang, offensive, etc.
        <br />
        Can still be played.
      </li>
      <li>
        <b>{{ obscure.toLocaleString() }}</b> <b>obscure</b> words
        <br />
        Uncommon, archaic, esoteric, etc.
        <br />
        Not allowed at all.
      </li>
    </ul>

    <form @submit.prevent="searchSubmit">
      <AppInput v-model="search" placeholder="Search" />
    </form>

    <div class="table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th style="min-width: 90px"></th>
            <th colspan="3">Links</th>
          </tr>
          <tr>
            <th v-for="(col, index) in cols" :key="index">
              <button @click="sort(col.key)">
                {{ col.name }}
                <template v-if="sortOrder[0]?.key === col.key">
                  <MoveUp v-if="sortOrder[0]?.dir === -1" />
                  <MoveDown v-else />
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
            :class="['row', selected?.text === word.text && 'selected']"
            tabindex="0"
            v-tooltip="'See info about word'"
            @click="select(word)"
            @keydown.enter="select(word)"
          >
            <td
              v-for="(col, index) in cols"
              :key="index"
              :class="index === 0 && 'upper'"
            >
              {{ word[col.key] }}
            </td>
          </tr>

          <tr v-if="filteredDictionary.length > limit">
            <td colspan="5" class="row">
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
        <b>
          {{ selected.text.toUpperCase() }}
        </b>

        <i>
          {{ selected.type }}
        </i>
      </div>

      <div class="detail" style="width: 100%">
        <template
          v-for="(type, index) in ['regular', 'special', 'obscure'] as const"
          :key="index"
        >
          <span>{{ startCase(type) }} Links</span>

          <div class="links">
            <button
              v-for="(word, index) in filter(selected.links, { type })"
              :key="index"
              @click="select(word)"
            >
              {{ word.text.toUpperCase() }}
            </button>
          </div>
        </template>
      </div>

      <ol v-if="info" class="definitions">
        <li
          v-for="({ part, description }, index) in info.definitions"
          :key="index"
        >
          <i>({{ part }})</i> {{ description }}
        </li>
      </ol>

      <div v-if="status === 'loading'" class="gray">
        Looking for definitions
      </div>
      <div v-if="status === 'error'" class="gray">
        Couldn't look up definitions automatically
      </div>

      <div class="details">
        <button
          v-if="info?.audio"
          class="primary square"
          v-tooltip="'Pronunciation'"
          @click="audio.play()"
        >
          <Volume2 />
        </button>

        <a
          :href="`https://www.google.com/search?q=define%3A+${selected.text}`"
          target="_blank"
        >
          Look up
          <ExternalLink />
        </a>
      </div>
    </template>
  </section>

  <section>
    <h2><Calendar1 class="gray" />Daily Game</h2>

    <p>
      The <RouterLink to="/daily">daily game</RouterLink> increases in
      difficulty (higher <b>par</b>) throughout the week and over the course of
      the month.
    </p>

    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(col, index) in difficulties" :key="index">
            <td class="label">{{ index + 1 }}</td>
            <td v-for="(row, index) in col" :key="index">
              <AppPar :par="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2><LandPlot class="gray" />Pars</h2>

    <p>
      Certain <b>pars</b> are more common than others. Here's the distribution
      of pars between all unique pairs of <b>regular</b> words. Par ∞ means no
      possible path.
    </p>

    <svg
      v-if="data?.pars"
      :viewBox="
        [-350, -chartHeight - 50, chartWidth + 370, chartHeight + 300].join(' ')
      "
      class="chart"
    >
      <path
        v-for="({ par, x, y, yLabel }, index) in chartData.data"
        :key="index"
        class="bar"
        :d="['M', x, 0, 'v', -y].join(' ')"
        :stroke="getDifficulty(par).color"
        tabindex="0"
        v-tooltip="yLabel"
      />

      <path
        class="axes"
        :d="
          ['M', 0, -chartHeight, 'v', chartHeight, 'h', chartWidth + 20].join(
            ' ',
          )
        "
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

  <AppFooter />
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from "vue";
import { clamp, filter, map, max, orderBy, range, startCase } from "lodash";
import {
  BookA,
  BowArrow,
  Calendar1,
  ExternalLink,
  LandPlot,
  MoveDown,
  MoveUp,
  Volume2,
} from "lucide-vue-next";
import AppFooter from "@/components/AppFooter.vue";
import AppInput from "@/components/AppInput.vue";
import AppPar, { getDifficulty } from "@/components/AppPar.vue";
import AppPath from "@/components/AppPath.vue";
import { data, infinitePar } from "@/data";
import { useQuery } from "@/util/composables";
import { sleep } from "@/util/misc";
import { difficulties, findPath, type Word } from "@/word";
import { getWordInfo } from "@/word/info";

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

  const a = lookupWord("word")!;
  const b = lookupWord("game")!;
  const par = findPath(a, b);

  return { a, b, par };
});

/** sort state */
const sortOrder = ref<{ key: string; dir: -1 | 1 }[]>([
  { key: "text", dir: 1 },
]);

/** switch sort */
const sort = (key: string) => {
  const primary = sortOrder.value[0];
  if (primary?.key === key) primary.dir *= -1;
  else
    sortOrder.value = [
      { key, dir: 1 as const },
      ...sortOrder.value.filter((entry) => entry.key !== key),
    ].slice(0, cols.length);
};

/** table cols */
const cols: { key: keyof (typeof dictionary.value)[number]; name: string }[] = [
  { key: "text", name: "Word" },
  { key: "type", name: "Type" },
  { key: "regularLinks", name: "Reg." },
  { key: "specialLinks", name: "Spec." },
  { key: "obscureLinks", name: "Obsc." },
];

/** table row limit */
const limit = 100;

/** show all table entries */
const showAll = ref(false);

/** sorted and searched dictionary */
const filteredDictionary = computed(() => {
  const _search = search.value.toLowerCase();
  return orderBy(
    dictionary.value,
    /** keys */
    map(sortOrder.value, ({ key }) =>
      key === "type"
        ? ({ type }) => -["regular", "special", "obscure"].indexOf(type)
        : key,
    ),
    /** directions */
    map(
      map(sortOrder.value, ({ key, dir }) => (key === "text" ? -dir : dir)),
      (value) => (value === -1 ? "asc" : "desc"),
    ),
  ).filter((word) => word.text.includes(_search));
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

/** search submit */
const searchSubmit = () => {
  const firstResult = filteredDictionary.value[0];
  if (firstResult) select(firstResult);
};

/** lookup info for selected word */
const { data: info, status, run } = useQuery(getWordInfo);

/** search for word info when selected changes */
watchEffect(() => selected.value && run(selected.value.text));

/** audio player */
const audio = ref(new Audio(""));
watchEffect(() => (audio.value.src = info.value?.audio ?? ""));

/** chart settings */
const chartWidth = 2000;
const chartHeight = 1000;

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
    chartWidth * ((0.5 + index) / length) + 10;
  const scaleY = (value: number) => chartHeight * normalize(value);

  /** bar item for each par */
  const bars = pars
    .map((pairs, index) =>
      pairs
        ? {
            par: index,
            value: pairs.length,
            xLabel: index === infinitePar ? "∞" : index,
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

.table {
  max-width: 100%;
  max-height: calc(10 * (1lh + 10px));
  overflow-x: auto;
  overflow-y: auto;
  background: var(--white);
  transition: background var(--fast);
}

table {
  border-collapse: collapse;
  text-align: center;
}

table button {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 5px 15px;
  gap: 0;
  border-radius: 0;
  background: none;
}

thead tr {
  position: sticky;
  top: 0;
}

th button {
  position: relative;
}

th button svg {
  position: absolute;
  right: 0;
}

th:not(:has(button)),
td {
  padding: 5px 10px;
}

.row {
  transition: background var(--fast);
}

.row:hover {
  background: var(--light-gray);
  cursor: pointer;
}

th,
.label {
  background: var(--light-gray);
  font-weight: var(--bold);
  transition: background var(--fast);
}

.upper {
  text-transform: uppercase;
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

.detail {
  display: grid;
  grid-template-columns: max-content 1fr;
  justify-items: flex-start;
  width: 100%;
  gap: 10px 20px;
  text-align: left;
}

.detail > :nth-child(odd) {
  font-weight: var(--bold);
}

.detail > :empty::after {
  content: "-";
  color: var(--gray);
  transition: color var(--fast);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 10px;
}

.links > button {
  padding: 0;
  color: var(--primary);
  transition: color var(--fast);
}

.definitions {
  text-align: left;
}

.chart text {
  fill: var(--black);
  font-size: 60px;
  transition: fill var(--fast);
}

.axes {
  fill: none;
  stroke: var(--black);
  stroke-width: 5px;
  transition: stroke var(--fast);
}

.bar {
  fill: none;
  stroke-width: 90px;
  transition: stroke var(--fast);
}

.x-axis {
  dominant-baseline: hanging;
  text-anchor: middle;
  translate: 0 2em;
}

.y-axis {
  dominant-baseline: central;
  text-anchor: middle;
  translate: -4em 0;
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
