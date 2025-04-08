<template>
  <div class="grid">
    <template v-for="(word, wordIndex) in path" :key="wordIndex">
      <AppChar
        v-for="(char, charIndex) in word.text"
        :key="charIndex"
        :link="
          !hide &&
          wordIndex < path.length - 1 &&
          path[wordIndex + 1]?.text[charIndex] !== char
        "
        :class="['flip']"
        :style="{
          '--dist': wordIndex / ((path.length ?? 1) - 1),
          '--delay': wordIndex * 0.4 + charIndex * 0.1 + 's',
        }"
      >
        {{ hide && inRange(wordIndex, 1, path.length - 1) ? "?" : char }}
      </AppChar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inRange } from "lodash";
import AppChar from "@/components/AppChar.vue";
import type { Word } from "@/word";

type Props = {
  path: Word[];
  hide?: boolean;
};

defineProps<Props>();
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, auto) !important;
  place-items: center;
  gap: 5px;
}
</style>
