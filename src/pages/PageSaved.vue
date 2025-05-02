<template>
  <section style="--col: 800px">
    <template v-if="!isEmpty(savedGames)">
      <template v-if="games.continue.length">
        <h2>Continue<Ellipsis class="info" /></h2>

        <div class="saved-games">
          <SavedGame
            v-for="(game, index) in games.continue"
            :key="index"
            v-bind="game"
          />
        </div>
      </template>

      <br />

      <template v-if="games.completed.length">
        <h2>Completed<CheckCircle class="success" /></h2>

        <div class="saved-games">
          <SavedGame
            v-for="(game, index) in games.completed"
            :key="index"
            v-bind="game"
          />
        </div>
      </template>

      <br />

      <button class="primary" @click="clearAll"><Trash2 /> Clear All</button>
    </template>

    <div v-else class="gray">No games yet</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isEmpty } from "lodash";
import { CheckCircle, Ellipsis, Trash2 } from "lucide-vue-next";
import { savedGames } from "@/util/storage";
import SavedGame from "./SavedGame.vue";

/** saved games split by type */
const games = computed(() => {
  const games = Object.values(savedGames.value).reverse();
  return {
    continue: games.filter(({ won }) => !won),
    completed: games.filter(({ won }) => won),
  };
});

/** remove all saved games */
const clearAll = () => {
  if (window.confirm("Clear all saved games? Can't be undone."))
    for (const key in savedGames.value) delete savedGames.value[key];
};
</script>

<style scoped>
.saved-games {
  display: grid;
  grid-template-columns: repeat(auto-fit, 235px);
  place-content: center;
  width: 100%;
  gap: 10px;
}
</style>
