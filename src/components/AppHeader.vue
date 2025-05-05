<template>
  <header>
    <!-- title -->
    <div class="title">
      <span
        v-for="(char, index) in VITE_TITLE"
        :key="index"
        class="wiggle-char wiggle-always"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        {{ char }}
      </span>
    </div>

    <!-- page name -->
    <h1>
      <span
        v-for="(char, index) in $route.meta.name"
        :key="index"
        class="wiggle-char wiggle-hover"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        {{ char }}
      </span>
    </h1>

    <!-- nav bar -->
    <nav>
      <template v-for="(route, index) in routes" :key="index">
        <RouterLink
          v-if="
            typeof route.meta.header === 'boolean'
              ? route.meta.header
              : route.meta.header.value
          "
          :to="route.path"
          :class="[
            'link',
            'underline',
            $route.meta.name === route.meta.name ? 'active' : 'inactive',
          ]"
          v-tooltip="route.meta.tooltip"
        >
          <component v-if="route.meta.icon" :is="route.meta.icon" />
        </RouterLink>
      </template>

      <button
        class="link"
        role="switch"
        :aria-checked="darkMode"
        @click="darkMode = !darkMode"
        v-tooltip="darkMode ? 'Light mode' : 'Dark mode'"
      >
        <Sun v-if="darkMode" /><Moon v-else />
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { Moon, Sun } from "lucide-vue-next";
import { useStorage } from "@vueuse/core";
import { routes } from "@/router";

const { VITE_TITLE } = import.meta.env;

/** dark mode state, saved to storage */
const darkMode = useStorage("dark-mode", false);

watchEffect(() => {
  /** update css vars via html attr */
  document.documentElement.setAttribute("data-dark", String(darkMode.value));
});
</script>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;
  border-bottom: solid 2px var(--light-gray);
  background: var(--off-white);
  color: var(--black);
  font-size: 1.2rem;
  line-height: 1;
  white-space: nowrap;
  transition:
    background var(--fast),
    color var(--fast),
    border-color var(--fast);
}

header > * {
  flex: 1 0 0;
}

.title {
  font-weight: var(--bold);
  text-align: left;
}

h1 {
  margin: 0;
  font-weight: unset;
  font-size: inherit;
}

nav {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

.link {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
}

@media (max-width: 600px) {
  header {
    font-size: 1rem;
  }

  .link {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 400px) {
  .title {
    display: none;
  }

  h1 {
    text-align: left;
  }
}
</style>
