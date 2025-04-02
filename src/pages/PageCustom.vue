<template>
  <section>
    <div class="col">
      <input v-model="a" placeholder="from word..." maxlength="4" />
      <button
        class="square"
        aria-label="Swap"
        @click="
          () => {
            const temp = a;
            a = b;
            b = temp;
          }
        "
      >
        ↕
      </button>
      <input v-model="b" placeholder="...to word" maxlength="4" />
    </div>

    <div v-if="!aWord || !bWord">Enter two 4-letter words</div>
    <div v-else-if="regularPath.length">Par: {{ regularPath.length }}</div>
    <div v-else-if="anyPath.length">
      Par: {{ anyPath.length }}
      <span class="error">w/ uncommon words</span>
    </div>
    <div v-else class="warning">No path between these words!</div>
    <button :disabled="!playable" @click="$router.push(`/${a}/${b}`)">
      Play
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { data } from "@/App.vue";
import { findPath } from "@/data/word";

/** start word text */
const a = ref("");
/** end word text */
const b = ref("");

/** start full word */
const aWord = computed(() => data.value?.lookupWord(a.value));

/** end full word */
const bWord = computed(() => data.value?.lookupWord(b.value));

/** get path between words */
const regularPath = computed(() =>
  aWord.value && bWord.value ? findPath(aWord.value, bWord.value) : [],
);

/** get special path between words */
const anyPath = computed(() =>
  aWord.value && bWord.value ? findPath(aWord.value, bWord.value, true) : [],
);

/** should user be allowed to play game */
const playable = computed(
  () =>
    aWord.value &&
    bWord.value &&
    aWord.value.text !== bWord.value.text &&
    (regularPath.value.length || anyPath.value.length),
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
