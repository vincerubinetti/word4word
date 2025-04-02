<template>
  <AppGame v-if="a && b" :a="a" :b="b" />
  <section v-else class="error">No words</section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { data, title } from "@/App.vue";
import AppGame from "@/components/AppGame.vue";
import { getDaily, type Word } from "@/data/word";

const route = useRoute();

/** start/end words */
const a = ref<Word>();
const b = ref<Word>();

/** decide start/end words */
watchEffect(() => {
  if (!data.value) return;

  const { pars, lookupWord } = data.value;
  const { params } = route;

  if (params.a && params.b) {
    /** get custom words from url */
    a.value = lookupWord(String(params.a));
    b.value = lookupWord(String(params.b));
  } else {
    /** get daily challenge */
    const daily = getDaily(pars);
    a.value = daily.a;
    b.value = daily.b;
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
