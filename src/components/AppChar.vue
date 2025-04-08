<template>
  <div v-bind="omit($attrs, 'class')" class="char">
    <div v-bind="pick($attrs, 'class')" class="letter">
      <slot />
    </div>
    <div v-if="link" class="link"></div>
  </div>
</template>

<script setup lang="ts">
import { omit, pick } from "lodash";

defineOptions({ inheritAttrs: false });

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
}

.link {
  z-index: -1;
  position: absolute;
  bottom: calc(100% + 5px / 2);
  left: 50%;
  width: 10px;
  height: 5px;
  translate: -50% 50%;
  background: var(--dark-gray);
  content: "";
  animation: appear 1s var(--delay, 0s) both;
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
}

@keyframes appear {
  from {
    opacity: 0;
  }
}
</style>
