<template>
  <RouterLink :to="`/${a.at(0)}/${b.at(-1)}`" class="saved-game">
    <span>{{ a.at(0) }} ↔ {{ b.at(-1) }}</span>
    <span class="count">
      <span>{{ a.length + b.length }}</span>
      <span>/</span>
      <span :style="{ color: getDifficulty(par).color }">{{ par }}</span>
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { getDifficulty } from "@/components/AppPar.vue";

type Props = {
  a: string[];
  b: string[];
  won: boolean;
  par: number;
};

defineProps<Props>();
</script>

<style scoped>
.saved-game {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  padding: 5px 15px;
  gap: 10px;
  border-radius: 999px;
  color: var(--dark-gray);
  text-decoration: none;
  text-transform: uppercase;
}

.saved-game:hover {
  background: var(--light-gray);
}

.count span:first-child {
  display: inline-block;
  translate: 0 -0.25em;
}

.count span:last-child {
  display: inline-block;
  translate: 0 0.25em;
}
</style>
