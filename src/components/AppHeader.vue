<template>
  <header>
    <h1>
      <span
        v-for="(char, index) in VITE_TITLE"
        :key="index"
        class="title wiggle-char wiggle-always"
        :style="{
          '--delay': index * 0.1 + 's',
          '--percent': index / (VITE_TITLE.length - 1),
        }"
      >
        {{ char }}
      </span>
    </h1>

    <nav>
      <template v-for="(route, index) in routes" :key="index">
        <RouterLink
          v-if="
            'header' in route.meta &&
            (typeof route.meta.header === 'boolean'
              ? route.meta.header
              : route.meta.header.value)
          "
          :to="route.path"
          :class="['underline', $route.name === route.name && 'active']"
          v-tooltip="'tooltip' in route.meta && route.meta.tooltip"
        >
          <component
            v-if="'icon' in route.meta && route.meta.icon"
            :is="route.meta.icon"
          />
        </RouterLink>
      </template>

      <button
        role="switch"
        :aria-checked="darkMode"
        @click="darkMode = !darkMode"
        v-tooltip="darkMode ? 'Switch to light Mode' : 'Switch to dark Mode'"
      >
        <Sun v-if="darkMode" /><Moon v-else />
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { Moon, Sun } from "lucide-vue-next";
import { useLocalStorage } from "@vueuse/core";
import { routes } from "@/router";

const { VITE_TITLE } = import.meta.env;

const darkMode = useLocalStorage("dark-mode", false);

watchEffect(() => {
  document.documentElement.setAttribute("data-dark", String(darkMode.value));
});
</script>

<style scoped>
header {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 10px 20px;
  background: var(--off-white);
}

h1 {
  position: relative;
  padding: 0 10px;
  text-align: left;
  white-space: nowrap;
}

h1 > span {
  --shadow: color-mix(
    in lch,
    var(--primary),
    var(--secondary) calc(100% * var(--percent, 0))
  );
}

nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

a,
button {
  display: inline-flex;
  padding: 5px;
  border-radius: 999px;
  color: var(--primary);
}

@media (max-width: 400px) {
  header {
    flex-direction: column;
  }
}
</style>
