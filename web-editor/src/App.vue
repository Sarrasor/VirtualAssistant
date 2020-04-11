<template>
  <div id="app">
    <Instruction :instructions="instructions" @select="index_in=$event" />
    <Step :steps="steps" @select="index_st=$event" />
    <Asset :assets="assets" @select="idnex_as=$event" />
    <Render />
  </div>
</template>

<script>
import Instruction from "./components/Instruction";
import Step from "./components/Step";
import Asset from "./components/Asset";
import Render from "./components/Render";

export default {
  name: "App",
  components: {
    Instruction,
    Step,
    Asset,
    Render
  },
  data() {
    return {
      index_in: undefined,
      instructions: [],
      index_st: undefined,
      steps: [],
      index_as: undefined,
      assets: []
    };
  },
  watch: {
    index_in: {
      handler: function(value) {
        this.steps =
          this.instructions?.length > 0 ? this.instructions[value].steps : null;
      },
      immediate: true
    },
    index_st: {
      handler: function(value) {
        this.assets = this.steps?.length > 0 ? this.steps[value].assets : null;
      },
      immediate: true
    },
  },
  methods: {}
};
</script>

<style scoped>
#app {
  width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 225px) 1fr;
}
</style>
