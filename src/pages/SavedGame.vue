<template>
  <RouterLink :to="`/${a.at(0)}/${b.at(-1)}`" class="saved-game">
    <span
      class="count"
      :style="{
        color: won && a.length + b.length <= par ? 'var(--success)' : '',
      }"
      >{{ a.length + b.length }}</span
    >
    <span />
    <span
      v-for="(char, index) in a.at(0)"
      :key="index"
      class="char-a flip"
      :style="{ '--delay': index * 0.1 + 's' }"
    >
      {{ char }}
    </span>
    <span />
    <span
      v-for="(char, index) in b.at(-1)"
      :key="index"
      class="char-b flip"
      :style="{ '--delay': (4 + index) * 0.1 + 's' }"
    >
      {{ char }}
    </span>
    <span />
    <span class="count" :style="{ color: getDifficulty(par).color }">
      {{ par }}
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
  display: grid;
  grid-template-columns: 20px 5px repeat(4, 20px) 5px repeat(4, 20px) 5px 20px;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
}

.saved-game:hover {
  background: var(--light-gray);
}

.char-a,
.char-b {
  color: var(--white);
}

.char-a {
  background: var(--primary);
}

.char-b {
  background: var(--secondary);
}

.count {
  color: var(--black);
  font-size: 0.75rem;
}
</style>
