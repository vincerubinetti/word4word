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
        >Source Code</a
      >
    </div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 10px 20px;
  background: var(--white);
  color: var(--black);
  font-size: 1.2rem;
  transition:
    background var(--fast),
    color var(--fast);
}
</style>
