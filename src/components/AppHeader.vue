<template>
  <header>
    <h1>
      <AppBop :text="VITE_TITLE" />
    </h1>

    <h2>{{ title }}</h2>

    <nav>
      <RouterLink to="/">
        <AppBop text="Daily" :hover="true" />
      </RouterLink>
      <RouterLink to="/custom">
        <AppBop text="Custom" :hover="true" />
      </RouterLink>
      <RouterLink to="/about">
        <AppBop text="About" :hover="true" />
      </RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { title } from "@/App.vue";
import AppBop from "./AppBop.vue";

const { VITE_TITLE } = import.meta.env;
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 0 10px;
  background: var(--light-gray);
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

nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0 10px;
}

h1 {
  padding: 10px;
}

a {
  padding: 10px;
  text-decoration: none;
}

@media (max-width: 800px) {
  header {
    flex-direction: column;
  }
}
</style>
