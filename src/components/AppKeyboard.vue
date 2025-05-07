<template>
  <Teleport to="body">
    <div
      ref="keyboardElement"
      :class="['keyboard', !show && 'hide']"
      aria-hidden="true"
    >
      <template v-for="(row, colIndex) in keys" :key="colIndex">
        <button
          v-for="(key, rowIndex) in row"
          :key="rowIndex"
          :class="[
            (key === '✓' || key === '←') && 'big',
            rowIndex === 0 && (colIndex !== 1 ? 'first-col' : 'second-row'),
          ]"
          @click="type(key)"
        >
          <CircleCheckBig v-if="key === '✓'" />
          <Delete v-else-if="key === '←'" />
          <template v-else>
            {{ key }}
          </template>
        </button>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from "vue";
import { debounce } from "lodash";
import { CircleCheckBig, Delete } from "lucide-vue-next";
import { useElementSize, useEventListener } from "@vueuse/core";

type Props = {
  /** input element to hook into */
  input?: HTMLInputElement | null;
};

const { input } = defineProps<Props>();

const keyboardElement = useTemplateRef("keyboardElement");

/** keyboard key rows */
const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["←", "Z", "X", "C", "V", "B", "N", "M", "✓"],
];

/** hide/show */
const show = ref(false);
const setShow = debounce((value: boolean) => (show.value = value), 100);
useEventListener(
  () => input,
  "focus",
  () => setShow(true),
);
useEventListener(
  () => input,
  "blur",
  () => setShow(false),
);

/** hide native keyboard input, e.g. on mobile */
watchEffect(() => input?.setAttribute("inputmode", "none"));

/** size of keyboard */
const measure = useElementSize(keyboardElement);

/** make room on screen for keyboard */
watchEffect(
  () =>
    (document.body.style.paddingBottom =
      (show.value ? measure.height.value : 0) + "px"),
);

/** on key press */
const type = (key: string) => {
  if (!input) return;

  setShow.cancel();
  input.focus();

  /** get selection */
  let { selectionStart: start, selectionEnd: end } = input;
  start ??= input.value.length;
  end ??= input.value.length;

  if (key === "✓")
    /** simulate enter */
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  else if (key === "←") {
    /** simulate backspace */
    document.execCommand("delete", false, key);
    // if (start === end) {
    //   if (start > 0) {
    //     input.value = input.value.slice(0, start - 1) + input.value.slice(end);
    //     input.selectionStart = start - 1;
    //     input.selectionEnd = start - 1;
    //   }
    // } else {
    //   input.value = input.value.slice(0, start) + input.value.slice(end);
    //   input.selectionStart = start;
    //   input.selectionEnd = start;
    // }
  } else {
    /** simulate type key */
    document.execCommand("insertText", false, key);
    // input.value = input.value.slice(0, start) + key + input.value.slice(end);
    // input.selectionStart = end + 1;
    // input.selectionEnd = end + 1;
    // input.dispatchEvent(new InputEvent("input"));
  }
};
</script>

<style scoped>
.keyboard {
  display: grid;
  position: fixed;
  bottom: 0;
  grid-template-columns: repeat(20, 1fr);
  grid-auto-rows: 40px;
  align-self: center;
  width: 100vw;
  max-width: 400px;
  padding: 5px;
  gap: 5px;
  translate: 0 0;
  border: solid 2px var(--light-gray);
  background: var(--white);
  font-weight: var(--bold);
  font-size: 1.1rem;
  transition:
    background var(--fast),
    translate var(--fast);
}

.hide {
  translate: 0 100%;
}

button {
  grid-column-end: span 2;
  padding: 0;
  background: var(--light-gray);
  touch-action: none;
}

button:hover {
  background: var(--gray);
}

.first-col {
  grid-column-start: 1;
}

.second-row {
  grid-column-start: 2;
}

.big {
  grid-column-end: span 3;
}
</style>
