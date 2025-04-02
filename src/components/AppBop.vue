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

.always {
  animation: var(--bop);
}

:has(> .hover):hover .hover {
  animation: var(--bop);
}
</style>
