<template>
  <header>
    <h1>
      <span
        v-for="(char, index) in VITE_TITLE"
        :key="index"
        class="wiggle-char wiggle-always"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        {{ char }}
      </span>
    </h1>

    <nav>
      <template v-for="(route, index) in routes" :key="index">
        <RouterLink
          v-if="route.meta.header"
          :to="route.path"
          :class="$route.name === route.name && 'active'"
        >
          <span
            v-for="(char, index) in route.name"
            :key="index"
            class="wiggle-char wiggle-hover"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            {{ char }}
          </span>
        </RouterLink>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
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
  gap: 10px 15px;
}

a {
  padding: 5px;
  border-bottom: solid 2px transparent;
  text-decoration: none;
}

.active {
  border-color: var(--gray);
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
