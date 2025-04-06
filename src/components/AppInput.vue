<template>
  <input
    ref="element"
    maxlength="4"
    autocapitalize="off"
    autocorrect="off"
    spellcheck="false"
    :value="modelValue"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

type Props = {
  modelValue: string;
};

defineProps<Props>();

type Emits = {
  "update:modelValue": [string];
};

const emit = defineEmits<Emits>();

const element = useTemplateRef("element");

const onInput = (event: Event) => {
  const element = event.target as HTMLInputElement;
  const value = element.value.toLowerCase().replaceAll(/[^a-z]*/g, "");
  element.value = value;
  emit("update:modelValue", value);
};

defineExpose({ element });
</script>

<style scoped>
input {
  font-weight: var(--bold);
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  text-transform: uppercase;
}
</style>
