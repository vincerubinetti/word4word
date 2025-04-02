<template>
  <section>
    {{ a.text }}
    {{ b.text }}
  </section>
</template>

<script setup lang="ts">
import type { Word } from "@/data/word";

type Props = {
  a: Word;
  b: Word;
};

const { a, b } = defineProps<Props>();
</script>
