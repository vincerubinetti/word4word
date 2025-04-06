<template>
  <div v-tooltip="`Difficulty: ${difficulty.tooltip}`" tabindex="0">
    <span>Par</span>
    <span class="difficulty" :style="{ color: difficulty.color }">
      {{ par || "???" }}
    </span>
  </div>
</template>

<script lang="ts">
/** map par to subjective difficulty */
export const getDifficulty = (par: number) => {
  if (par === 0) return { tooltip: "", color: "" };
  if (par <= 6) return { tooltip: "Easy", color: "var(--easy)" };
  if (par <= 10) return { tooltip: "Medium", color: "var(--medium)" };
  if (par <= 15) return { tooltip: "Hard", color: "var(--hard)" };
  if (par <= 63) return { tooltip: "Expert", color: "var(--expert)" };
  return { tooltip: "Impossible", color: "var(--dark-gray)" };
};
</script>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  par: number;
};

const { par } = defineProps<Props>();

const difficulty = computed(() => getDifficulty(par));
</script>

<style scoped>
div {
  display: flex;
  gap: 5px;
}

.difficulty {
  font-weight: var(--bold);
}
</style>
