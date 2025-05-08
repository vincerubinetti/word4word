<template>
  <button
    class="secondary square"
    @click="show = !show"
    v-tooltip="show ? 'Hide game keyboard' : 'Show game keyboard'"
  >
    <KeyboardOff v-if="show" />
    <Keyboard v-else />
  </button>
  <Teleport to="body">
    <div
      ref="keyboardElement"
      :class="['keyboard', !show && 'hide']"
      aria-hidden="true"
      @touchstart.prevent
      @mousedown.prevent
      @click.prevent
    >
      <template v-for="(row, colIndex) in keys" :key="colIndex">
        <button
          v-for="(key, rowIndex) in row"
          :key="rowIndex"
          :class="[
            'key',
            (key === '✓' || key === '←') && 'big',
            rowIndex === 0 && (colIndex !== 1 ? 'first-col' : 'second-row'),
          ]"
          @touchstart.prevent.stop="type(key)"
          @mousedown.prevent.stop="type(key)"
          @click.prevent
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
import { onUnmounted, ref, useTemplateRef, watchEffect } from "vue";
import { CircleCheckBig, Delete, Keyboard, KeyboardOff } from "lucide-vue-next";
import { useElementSize } from "@vueuse/core";

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
const show = ref("ontouchstart" in window);

/** hide native keyboard input, e.g. on mobile */
watchEffect(() => {
  input?.focus();
  if (show.value) input?.setAttribute("inputmode", "none");
  else input?.removeAttribute("inputmode");
});

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
  } else {
    /** simulate type key */
    document.execCommand("insertText", false, key);
  }
};

/** reset external things */
onUnmounted(() => {
  input?.setAttribute("inputmode", "none");
  document.body.style.paddingBottom = "";
});
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

.key {
  grid-column-end: span 2;
  padding: 2px;
  background: var(--off-white) content-box;
  touch-action: none;
}

.key:active {
  background-color: var(--gray);
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
