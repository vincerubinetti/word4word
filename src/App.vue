<template>
  <AppHeader />
  <main>
    <section v-if="status !== 'success'">{{ startCase(status) }}</section>
    <RouterView v-else />
  </main>
</template>

<script setup lang="ts">
import { onMounted, provide, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { startCase } from "lodash";
import { loadData } from "@/data/word";
import { useQuery } from "@/util/composables";
import AppHeader from "./components/AppHeader.vue";

/** load game data on mount */
const { status, data, run } = useQuery(loadData);
onMounted(run);

/** provide data to rest of app */
provide("data", data);

const { VITE_TITLE } = import.meta.env;

/** update tab title */
const route = useRoute();
watchEffect(() => {
  document.title = [startCase(String(route.name ?? "")), VITE_TITLE]
    .filter(Boolean)
    .join(" | ");
});
</script>
