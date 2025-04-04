<template>
  <span
    class="difficulty"
    :style="{ color: difficulty.color }"
    :title="difficulty.text"
    >{{ par || "???" }}</span
  >
</template>

<script setup lang="ts">
import { computed } from "vue";

type Props = {
  par: number;
};

const { par } = defineProps<Props>();

const difficulty = computed(() => {
  if (par === 0) return { text: "", color: "" };
  if (par <= 7) return { text: "Easy", color: "#059669" };
  if (par <= 12) return { text: "Medium", color: "#4f46e5" };
  if (par <= 16) return { text: "Hard", color: "#ea580c" };
  if (par <= 23) return { text: "Expert", color: "#e11d48" };
  return { text: "", color: "" };
});
</script>

<style scoped>
.difficulty {
  font-weight: var(--bold);
}
</style>
