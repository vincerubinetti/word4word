<template>
  <input
    ref="element"
    pattern="[A-Za-z]*"
    :maxlength="maxLength"
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

const maxLength = 4;

/** on type */
const onInput = (event: Event) => {
  const element = event.target as HTMLInputElement;
  /** sanitize */
  const value = element.value
    .toLowerCase()
    .replaceAll(/[^a-z]*/g, "")
    .slice(0, maxLength);
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
