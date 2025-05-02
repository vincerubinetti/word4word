<template>
  <component :is="component ?? 'div'" tabindex="0" v-tooltip="difficulty.text">
    <slot />
    <span :style="{ color: difficulty.color }">
      {{ par || "?" }}
    </span>
  </component>
</template>

<script lang="ts">
/** map par to subjective difficulty */
export const getDifficulty = (par: number) => {
  if (par > 0) {
    if (par <= 8) return { text: "Easy", color: "var(--easy)" };
    if (par <= 13) return { text: "Medium", color: "var(--medium)" };
    if (par <= maxPar) return { text: "Hard", color: "var(--hard)" };
  }
  return { text: "?", color: "var(--dark-gray)" };
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
  justify-content: center;
  gap: 5px;
}

span {
  transition: color var(--fast);
}
</style>
