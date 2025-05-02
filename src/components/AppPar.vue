<template>
  <component
    :is="component ?? 'div'"
    tabindex="0"
    v-tooltip="`Difficulty: ${difficulty.tooltip}`"
  >
    <slot />
    <span :style="{ color: difficulty.color }">
      {{ par || "???" }}
    </span>
  </component>
</template>

<script lang="ts">
/** map par to subjective difficulty */
export const getDifficulty = (par: number) => {
  if (par > 0) {
    if (par <= 8) return { tooltip: "Easy", color: "var(--easy)" };
    if (par <= 13) return { tooltip: "Medium", color: "var(--medium)" };
    if (par <= maxPar) return { tooltip: "Hard", color: "var(--hard)" };
  }
  return { tooltip: "???", color: "var(--dark-gray)" };
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { maxPar } from "@/data";

type Props = {
  par: number;
  component?: string;
};

const { par } = defineProps<Props>();

const difficulty = computed(() => getDifficulty(par));
</script>

<style scoped>
div {
  display: flex;
  gap: 5px;
}

span {
  transition: color var(--fast);
}
</style>
