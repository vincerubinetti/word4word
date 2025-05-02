<template>
  <RouterLink
    :to="`/${a.at(0)}/${b.at(-1)}`"
    class="saved-game"
    v-tooltip="
      [
        type ? `${startCase(type)} game` : '',
        started || '',
        `Yours ${yours}, Par ${par ?? '?'}`,
      ]
        .filter(Boolean)
        .join('<br>')
    "
  >
    <span
      class="count"
      :style="{ color: par && won && yours <= par ? 'var(--success)' : '' }"
      >{{ yours }}</span
    >
    <span />
    <span
      v-for="(char, index) in a.at(0)"
      :key="index"
      class="char-a flip wiggle-hover"
      :style="{ '--delay': index * 0.1 + 's' }"
    >
      {{ char }}
    </span>
    <span />
    <span
      v-for="(char, index) in b.at(-1)"
      :key="index"
      class="char-b flip wiggle-hover"
      :style="{ '--delay': (4 + index) * 0.1 + 's' }"
    >
      {{ char }}
    </span>
    <span />
    <span class="count" :style="{ color: par ? getDifficulty(par).color : '' }">
      {{ par ?? "" }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { startCase } from "lodash";
import { getDifficulty } from "@/components/AppPar.vue";
import type { SavedGame } from "@/util/storage";

type Props = SavedGame;

const { a, b } = defineProps<Props>();

const yours = computed(() => a.length + b.length);
</script>

<style scoped>
.saved-game {
  display: grid;
  grid-template-columns: 20px 5px repeat(4, 20px) 5px repeat(4, 20px) 5px 20px;
  align-items: center;
  padding: 5px;
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
