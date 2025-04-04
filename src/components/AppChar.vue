<template>
  <div class="char flip">
    <slot />
  </div>
</template>

<style scoped>
.char {
  display: grid;
  grid-column: calc(var(--col) + 2);
  place-items: center;
  width: 40px;
  height: 40px;
  background: color-mix(
    in lch,
    var(--primary),
    var(--secondary) calc(100% * var(--dist, 0))
  );
  color: var(--white);
  font-weight: var(--extra-bold);
  font-size: 1.2rem;
  text-transform: uppercase;
}

.highlight {
  box-shadow: inset 0 0 0 2px var(--black);
}
</style>
