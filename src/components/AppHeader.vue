<template>
  <header>
    <RouterLink to="/">Daily</RouterLink>
    <RouterLink to="/custom">Custom</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </header>
</template>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  background: var(--light-gray);
  box-shadow: var(--box-shadow);
}

a {
  padding: 10px;
  text-decoration: none;
}
</style>
