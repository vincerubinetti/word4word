<template>
  <!-- dev page to generate favicons, share thumbnail  -->
  <div class="icon">
    <span>4</span>
  </div>
  <div class="share">
    <span>
      {{ VITE_TITLE }}
    </span>
    <AppPath :path="path" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppPath from "@/components/AppPath.vue";
import { data } from "@/data";
import { findPath } from "@/word";

const { VITE_TITLE } = import.meta.env;

/** example path */
const path = computed(() => {
  if (!data.value) return [];
  const { lookupWord } = data.value;
  const a = lookupWord("word")!;
  const b = lookupWord("game")!;
  return findPath(a, b);
});
</script>

<style scoped>
.icon {
  display: grid;
  place-items: center;
  width: 512px;
  height: 512px;
  background: var(--primary);
  color: var(--white);
  font-weight: var(--bold);
  font-size: 480px;
  line-height: 1;
}

.icon span {
  translate: -8px -16px;
  filter: drop-shadow(0 4px 0 var(--black)) drop-shadow(0 4px 0 var(--black))
    drop-shadow(0 4px 0 var(--black)) drop-shadow(0 4px 0 var(--black))
    drop-shadow(0 4px 0 var(--black)) drop-shadow(0 4px 0 var(--black))
    drop-shadow(0 4px 0 var(--black)) drop-shadow(0 4px 0 var(--black));
}

.share {
  display: grid;
  place-content: center;
  place-items: center;
  width: 800px;
  height: 600px;
  gap: 50px;
  background: var(--off-white);
  color: var(--black);
  font-weight: var(--bold);
  font-size: 40px;
  line-height: 1;
}

.share span {
  filter: drop-shadow(0 1px 0 var(--gray)) drop-shadow(0 1px 0 var(--gray))
    drop-shadow(0 1px 0 var(--gray)) drop-shadow(0 1px 0 var(--gray));
}
</style>
