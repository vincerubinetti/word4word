<template>
  <section
    v-if="showKeyboard && needsKeyboard"
    class="keyboard-float"
    @click="
      () => {
        show();
        inputElement?.focus();
      }
    "
  >
    <div class="keyboard">
      <div v-for="(row, index) in buttons" :key="index" class="row">
        <button
          v-for="(key, index) in row"
          :key="index"
          @click.prevent="type(key)"
        >
          {{ key }}
        </button>
        <template v-if="index === 2">
          <button class="enter" @click.prevent="enter"><Check /></button>
          <button class="backspace" @click.prevent="backspace">
            <ArrowLeft />
          </button>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { debounce } from "lodash";
import { ArrowLeft, Check } from "lucide-vue-next";
import { useEventListener } from "@vueuse/core";

type Props = {
  inputElement?: HTMLInputElement | null;
};

const { inputElement } = defineProps<Props>();

const buttons = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const needsKeyboard = "ontouchstart" in document.documentElement;

const showKeyboard = ref(false);

const hide = debounce(() => (showKeyboard.value = false), 100);
const show = () => {
  showKeyboard.value = true;
  hide.cancel();
};

useEventListener(() => inputElement, "focus", show);
useEventListener(() => inputElement, "blur", hide);

const type = (key: (typeof buttons)[number][number]) => {
  if (!inputElement) return;
  inputElement.value += key;
  inputElement.dispatchEvent(new Event("input"));
};

const enter = () =>
  inputElement?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
const backspace = () => {
  if (!inputElement) return;
  inputElement.value = inputElement.value.slice(0, -1);
  inputElement.dispatchEvent(new Event("input"));
};
</script>

<style scoped>
.keyboard-float {
  position: sticky;
  bottom: 0;
  padding: 10px;
  background: var(--white);
}

.keyboard {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: min-content;
  gap: 5px;
}

.row {
  display: flex;
  justify-content: center;
  gap: 5px;
}

button {
  aspect-ratio: 1 / 2;
  width: 20px;
  padding: 0;
  background: var(--light-gray);
  color: var(--black);
  font-weight: var(--bold);
  text-transform: uppercase;
}

button:hover {
  background: var(--gray);
}

.enter,
.backspace {
  flex-grow: 1;
  aspect-ratio: unset;
}

.enter {
  order: -1;
}
</style>
