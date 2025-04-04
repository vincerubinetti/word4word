<template>
  <section>
    <h2>How To Play</h2>

    <p>
      Get from one 4-letter word to another, changing only
      <b>one letter at a time</b> and only using valid English words. Take this
      <b>par {{ example?.par.length }}</b> example between
      {{ example?.a.text.toUpperCase() }} and
      {{ example?.b.text.toUpperCase() }}:
    </p>

    <div class="grid">
      <template v-for="(word, wordIndex) in example?.par" :key="wordIndex">
        <component
          v-for="(char, charIndex) in word.text"
          :key="charIndex"
          :is="
            example?.par[wordIndex - 1]?.text[charIndex] !== char ||
            wordIndex === (example?.par.length ?? 0) - 1
              ? 'b'
              : 'span'
          "
          >{{ char.toUpperCase() }}</component
        >
      </template>
    </div>

    <p>
      That's it! Try to connect the words in as few steps as you can. The
      <b>par</b> is the smallest amount of steps possible using only
      <i>regular</i> words, so you have to be very <i>special</i> to beat it.
    </p>

    <h2>Dictionary</h2>

    <div class="flex-col">
      <p>
        This game has a total of
        <b>{{ total.toLocaleString() }}</b> 4-letter words:
      </p>

      <p style="padding-left: 40px">
        <b>{{ regular.toLocaleString() }}</b> <i>regular</i> words, very
        commonly known and used<br />
        <b>{{ special.toLocaleString() }}</b> <i>special</i> words, known but
        not used every day, or otherwise special like names<br />
        <b>{{ obscure.toLocaleString() }}</b> <i>obscure</i> words, rarely known
        or used
      </p>

      <p>
        <i>Regular</i> words are used to find the par. <i>Special</i> words can
        still be played. <i>Obscure</i> words are not allowed at all.
      </p>
    </div>

    <h2>Fun Facts</h2>

    <p></p>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { data } from "@/App.vue";
import { findPath } from "@/data/word";

const dictionary = computed(() => data.value?.dictionary ?? []);

const total = computed(() => dictionary.value.length);
const regular = computed(
  () => dictionary.value.filter(({ type }) => type === "regular").length,
);
const special = computed(
  () => dictionary.value.filter(({ type }) => type === "special").length,
);
const obscure = computed(
  () => dictionary.value.filter(({ type }) => type === "obscure").length,
);

const example = computed(() => {
  if (!data.value) return;

  const { lookupWord } = data.value;

  const a = lookupWord("pool")!;
  const b = lookupWord("bush")!;
  const par = findPath(a, b);

  return { a, b, par };
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1em);
  place-items: center;
}
</style>
