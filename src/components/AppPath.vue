<template>
  <div class="grid">
    <template v-for="(word, wordIndex) in path" :key="wordIndex">
      <AppChar
        v-for="(char, charIndex) in word.text"
        :key="charIndex"
        v-bind="$attrs"
        :link="
          !redact &&
          wordIndex < path.length - 1 &&
          path[wordIndex + 1]?.text[charIndex] !== char
        "
        :style="{
          '--dist': wordIndex / ((path.length ?? 1) - 1),
          '--delay': wordIndex * 0.2 + charIndex * 0.1 + 's',
        }"
      >
        {{ redact && inRange(wordIndex, 1, path.length - 1) ? "?" : char }}
      </AppChar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inRange } from "lodash";
import AppChar from "@/components/AppChar.vue";
import type { Word } from "@/word";

defineOptions({ inheritAttrs: false });

type Props = {
  path: Word[];
  redact?: boolean;
};

defineProps<Props>();
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, auto) !important;
  gap: 5px;
}
</style>
