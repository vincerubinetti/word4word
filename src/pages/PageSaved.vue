<template>
  <section>
    <template v-if="!isEmpty(savedGames)">
      <div class="saved-games">
        <RouterLink
          v-for="({ a, b, won }, index) in Object.values(savedGames)"
          :to="`/${a.at(0)}/${b.at(-1)}`"
          :key="index"
          class="saved-game"
          v-tooltip="won ? 'Admire game' : 'Continue game'"
        >
          {{ a.at(0) }}
          ↔
          {{ b.at(-1) }}
          <CircleCheck v-if="won" class="icon success" />
          <CircleEllipsis v-if="!won" class="icon info" />
        </RouterLink>
      </div>

      <br />

      <button class="primary" @click="clearAll">Clear All</button>
    </template>

    <div v-else class="gray">No games yet</div>
  </section>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash";
import { CircleCheck, CircleEllipsis } from "lucide-vue-next";
import { savedGames } from "@/util/storage";

const clearAll = () => {
  if (window.confirm("Clear all saved games? Can't be undone."))
    for (const key in savedGames.value)
      if (key !== "lastGame") delete savedGames.value[key];
};
</script>

<style scoped>
.saved-games {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 5px 10px;
}

.saved-game {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  gap: 5px;
  text-decoration: none;
}

.icon {
  fill: currentColor;
  flex-shrink: 0;
  stroke: var(--white);
  transition: stroke var(--fast);
}
</style>
