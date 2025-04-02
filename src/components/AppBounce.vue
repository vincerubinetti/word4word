<template>
  <span
    v-for="(char, index) of text.split('')"
    :key="index"
    :class="{ always: !hover, hover: hover }"
    :style="{ animationDelay: 0.1 * index + 's' }"
    >{{ char }}</span
  >
</template>

<script setup lang="ts">
type Props = {
  text: string;
  hover?: boolean;
};

defineProps<Props>();
</script>

<style scoped>
span {
  display: inline-block;
}

.always,
:has(> .hover):hover .hover {
  animation: bounce 3s both infinite cubic-bezier(0.5, 0, 0.5, 1);
}

@keyframes bounce {
  0% {
    translate: 0 0;
    filter: drop-shadow(0px 0px transparent);
  }

  10% {
    translate: 0 -2.5px;
    filter: drop-shadow(0px 2.5px var(--gray));
  }
  20% {
    translate: 0 0;
    filter: drop-shadow(0px 0px transparent);
  }
}
</style>
