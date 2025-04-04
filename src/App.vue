<template>
  <AppHeader />
  <main>
    <section
      v-if="status !== 'success'"
      :class="{
        gray: status === 'loading',
        error: status === 'error',
      }"
    >
      {{ startCase(status) }}
    </section>
    <RouterView v-else />
  </main>
</template>

<script lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { startCase } from "lodash";
import { loadData } from "@/data/word";
import { useQuery } from "@/util/composables";
import AppHeader from "./components/AppHeader.vue";

/** load game data on mount */
const query = useQuery(loadData);

/** game data */
export const data = query.data;
export const status = query.status;

/** page title */
export const title = ref("");

const { VITE_TITLE } = import.meta.env;

/** update tab title */
watchEffect(() => {
  document.title = [title.value, VITE_TITLE].filter(Boolean).join(" | ");
});
</script>

<script setup lang="ts">
/** load game data on mount */
onMounted(query.run);

const route = useRoute();

/** update tab title */
watchEffect(() => (title.value = String(route.name ?? "")));
</script>
