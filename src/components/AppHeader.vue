<template>
  <header>
    <h1>
      <AppBounce :text="VITE_TITLE" />
    </h1>

    <nav>
      <template v-for="(route, index) in routes" :key="index">
        <RouterLink
          v-if="route.meta.header"
          :to="route.path"
          :class="$route.path === route.path && 'active'"
        >
          <AppBounce :text="route.name" :hover="true" />
        </RouterLink>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
import AppBounce from "@/components/AppBounce.vue";
import { routes } from "@/router";

const { VITE_TITLE } = import.meta.env;
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;
  background: var(--off-white);
}

header > * {
  flex-grow: 1;
  flex-basis: 0;
}

header > :first-child {
  text-align: left;
}

header > :last-child {
  justify-content: flex-end;
}

h1 {
  white-space: nowrap;
}

nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

a {
  padding: 5px 10px;
  border-radius: 999px;
  text-decoration: none;
  transition: background var(--fast), color var(--fast);
}

.active {
  background: var(--light-gray);
}

@media (max-width: 500px) {
  header {
    flex-direction: column;
  }
}

@media (max-width: 300px) {
  nav {
    flex-direction: column;
  }
}
</style>
