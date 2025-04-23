<template>
  <footer>
    <div>
      &copy; 2025
      <a href="https://vincentrubinetti.com" target="_blank"
        >Vincent Rubinetti</a
      >
    </div>
    <div>
      <a href="https://github.com/vincerubinetti/word4word" target="_blank"
        >Source</a
      >
    </div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  gap: 10px 20px;
  background: var(--off-white);
}

a {
  display: inline-block;
  padding: 5px;
  text-decoration: none;
}
</style>
