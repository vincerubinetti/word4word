<template>
  <AppHeader />

  <main>
    <!-- game data status -->
    <section v-if="status === 'loading'" class="gray">
      Loading game data
    </section>
    <section v-else-if="status === 'error'" class="error">
      Error loading game data
    </section>

    <!-- page -->
    <RouterView v-else />
  </main>
</template>

<script lang="ts">
/** page title */
export const title = ref("");

const { VITE_TITLE } = import.meta.env;

/** update tab title from page title */
watchEffect(() => {
  document.title = [title.value, VITE_TITLE].filter(Boolean).join(" | ");
});
</script>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { status } from "@/data";

const route = useRoute();

/** update page title */
watchEffect(() => (title.value = String(route?.meta.name ?? "")));
</script>
