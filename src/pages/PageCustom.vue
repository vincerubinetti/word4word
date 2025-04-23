<template>
  <section>
    <form @submit.prevent="$router.push(`/${a}/${b}`)">
      <AppInput v-model.trim="a" placeholder="From" />
      <AppInput v-model.trim="b" placeholder="To" />

      <div v-if="a.length < 4 || b.length < 4">Enter two 4-letter words</div>
      <div v-else-if="!aWord || !bWord">Enter valid words</div>
      <AppPar v-else-if="par.length" :par="par.length" />
      <div v-else class="error">No path between these words!</div>

      <button type="submit" class="primary" :disabled="!playable">Play</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import AppInput from "@/components/AppInput.vue";
import AppPar from "@/components/AppPar.vue";
import { data } from "@/data";
import { findPath } from "@/word";

/** start word text */
const a = ref("");
/** end word text */
const b = ref("");

/** start full word */
const aWord = computed(() => data.value?.lookupWord(a.value));

/** end full word */
const bWord = computed(() => data.value?.lookupWord(b.value));

/** get par path between words */
const par = computed(() =>
  aWord.value && bWord.value ? findPath(aWord.value, bWord.value) : [],
);

/** get par path between words, using more advanced words */
const specialPar = computed(() =>
  aWord.value && bWord.value
    ? findPath(aWord.value, bWord.value, ["regular", "special"])
    : [],
);

/** debug/cheat */
watchEffect(() => {
  for (const path of [par.value, specialPar.value].filter(
    (path) => path.length,
  )) {
    console.groupCollapsed("cheater");
    for (const { text } of path) console.debug(text);
    console.groupEnd();
  }
});

/** should user be allowed to play game */
const playable = computed(
  () =>
    aWord.value &&
    bWord.value &&
    aWord.value.text !== bWord.value.text &&
    par.value.length,
);
</script>
