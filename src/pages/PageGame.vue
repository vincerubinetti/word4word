<template>
  <AppGame v-if="a && b" :a="a" :b="b" />
  <section v-else class="error">No words</section>
</template>

<script setup lang="ts">
import { shallowRef, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { data, title } from "@/App.vue";
import AppGame from "@/components/AppGame.vue";
import { getDaily, type Word } from "@/data/word";

const route = useRoute();

/** start/end words */
const a = shallowRef<Word>();
const b = shallowRef<Word>();

/** decide start/end words */
watchEffect(() => {
  if (!data.value) return;

  const { pars, lookupWord } = data.value;
  const { params } = route;

  /** get custom words from url */
  if (params.a && params.b) {
    a.value = lookupWord(String(params.a));
    b.value = lookupWord(String(params.b));
  } else {
    /** get daily challenge */
    const daily = getDaily(pars);
    a.value = daily.a;
    b.value = daily.b;
  }

  if (a.value && b.value) title.value = `${a.value.text} ↔ ${b.value.text}`;
});
</script>
