<template>
  <AppGame v-if="a && b" :a="a" :b="b" :type="type" :started="started" />
  <section v-else class="error">Couldn't find words</section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppGame from "@/components/AppGame.vue";
import { data } from "@/data";
import type { Word } from "@/word";
import { getDaily } from "@/word";

const route = useRoute();
const router = useRouter();

/** start/end words */
const a = ref<Word>();
const b = ref<Word>();

/** date game started */
const started = ref("");
/** type of game */
const type = ref("");

/** decide start/end words */
watchEffect(() => {
  if (!data.value) return;

  const { pars, lookupWord } = data.value;
  const { params } = route;

  /** set start timestamp */
  started.value = new Date().toDateString();

  // test daily picks
  // for (let i = 0; i < 100; i++) {
  //   const today = new Date(new Date().getTime() + i * 1000 * 60 * 60 * 24);
  //   console.time("getDaily");
  //   const { a, b } = getDaily(pars, today);
  //   console.timeEnd("getDaily");
  //   console.log(a.text, b.text);
  // }

  /** get daily game */
  const daily = getDaily(pars);

  /** normalize to alphabetical */
  if (daily.a.text > daily.b.text) {
    const temp = daily.a;
    daily.a = daily.b;
    daily.b = temp;
  }

  /** get words from url */
  params.a = String(params.a ?? "");
  params.b = String(params.b ?? "");

  /** normalize to alphabetical */
  if (params.a > params.b) {
    const temp = params.a;
    params.a = params.b;
    params.b = temp;
  }

  if (params.a && params.b) {
    /** if url words match daily words (e.g. when following daily share link) */
    if (params.a === daily.a.text && params.b === daily.b.text)
      /** go to daily game */
      return router.push({ path: "/", replace: true });

    /** get type words from url */
    a.value = lookupWord(String(params.a));
    b.value = lookupWord(String(params.b));
    type.value = "custom";
  } else {
    /** use daily words */
    a.value = daily.a;
    b.value = daily.b;
    type.value = "daily";
  }

  if (!a.value || !b.value) return;

  /** update page title */
  // title.value = `${a.value.text} ↔ ${b.value.text}`;
});
</script>
