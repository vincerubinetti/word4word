<template>
  <div class="char">
    <div class="letter">
      <slot />
    </div>
    <div v-if="link" class="link"></div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  link?: boolean;
};

defineProps<Props>();
</script>

<style scoped>
.char {
  --color: color-mix(
    in lch,
    var(--primary),
    var(--secondary) calc(100% * var(--dist, 0))
  );
  position: relative;
  grid-column: calc(var(--col) + 2);
}

.letter {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  background: var(--color);
  color: var(--white);
  font-weight: var(--extra-bold);
  font-size: 1.2rem;
  text-transform: uppercase;
  transition:
    background var(--fast),
    color var(--fast);
}

.link {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 10px;
  height: 5px;
  translate: -50% 0;
  scale: 1.1;
  background: var(--color);
  content: "";
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  transition: background var(--fast);
}
</style>
