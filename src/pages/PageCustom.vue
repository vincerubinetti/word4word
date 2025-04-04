<template>
  <section>
    <div class="flex-col">
      <input v-model="a" placeholder="from word..." maxlength="4" />
      <input v-model="b" placeholder="...to word" maxlength="4" />

      <div v-if="a.length < 4 || b.length < 4">Enter two 4-letter words</div>
      <div v-else-if="!aWord || !bWord">Enter valid words</div>
      <div v-else-if="par.length">Par: <AppPar :par="par.length" /></div>
      <div v-else class="warning">No path between these words!</div>
    </div>

    <button
      class="primary"
      :disabled="!playable"
      @click="$router.push(`/${a}/${b}`)"
    >
      Play
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { data } from "@/App.vue";
import AppPar from "@/components/AppPar.vue";
import { findPath } from "@/data/word";

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

watchEffect(() => {
  console.groupCollapsed("cheater");
  for (const { text } of par.value) console.debug(text);
  console.groupEnd();
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

<style scoped>
input,
button {
  width: 200px;
  max-width: 100%;
  text-transform: uppercase;
}
</style>
