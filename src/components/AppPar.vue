<template>
  <span
    class="difficulty"
    :style="{ color: difficulty.color, fill: difficulty.color }"
    :title="`Difficulty: ${difficulty.text}`"
  >
    {{ par || "???" }}
  </span>
</template>

<script lang="ts">
export const getDifficulty = (par: number) => {
  if (par === 0) return { text: "", color: "" };
  if (par <= 5) return { text: "easy", color: "var(--easy)" };
  if (par <= 9) return { text: "medium", color: "var(--medium)" };
  if (par <= 15) return { text: "hard", color: "var(--hard)" };
  if (par <= 63) return { text: "expert", color: "var(--expert)" };
  return { text: "impossible", color: "var(--dark-gray)" };
};
</script>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  par: number;
};

const { par } = defineProps<Props>();

/** map par to subjective difficulty */
const difficulty = computed(() => getDifficulty(par));
</script>

<style scoped>
.difficulty {
  font-weight: var(--bold);
}
</style>
