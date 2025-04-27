<template>
  <AppGame v-if="a && b" :a="a" :b="b" />
  <section v-else class="error">Couldn't find words</section>
</template>

<script lang="ts">
/** daily game */
const daily = ref<ReturnType<typeof getDaily>>();
</script>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { title } from "@/App.vue";
import AppGame from "@/components/AppGame.vue";
import { data } from "@/data";
import { getDaily, type Word } from "@/word";

const route = useRoute();

/** start/end words */
const a = ref<Word>();
const b = ref<Word>();

/** decide start/end words */
watchEffect(() => {
  if (!data.value) return;

  const { pars, lookupWord } = data.value;
  const { params } = route;

  // test daily picks
  // for (let i = 0; i < 100; i++) {
  //   const today = new Date(new Date().getTime() + i * 1000 * 60 * 60 * 24);
  //   console.time("getDaily");
  //   const { a, b } = getDaily(pars, today);
  //   console.timeEnd("getDaily");
  //   console.debug(a.text, b.text);
  // }

  if (params.a && params.b) {
    /** get custom words from url */
    a.value = lookupWord(String(params.a));
    b.value = lookupWord(String(params.b));
  } else {
    /** get daily game */
    try {
      daily.value ??= getDaily(pars);
      a.value = daily.value.a;
      b.value = daily.value.b;
    } catch (error) {
      console.error(error);
    }
  }

  if (a.value && b.value) {
    /** normalize to alphabetical */
    if (a.value.text > b.value.text) {
      const temp = a.value;
      a.value = b.value;
      b.value = temp;
    }

    /** update page title */
    title.value = `${a.value.text} ↔ ${b.value.text}`;
  }
});
</script>
