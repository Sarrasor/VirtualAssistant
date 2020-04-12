<template>
  <div id="app">
    <Instruction :instructions="instructions" @select="selectInstruction" />
    <Step :steps="steps" @select="selectStep" />
    <Asset :assets="assets" />
    <Render />
  </div>
</template>

<script>
import Instruction from "./components/Instruction";
import Step from "./components/Step";
import Asset from "./components/Asset";
import Render from "./components/Render";

import Vue from "vue";
Vue.prototype.$toFloat = f => {
  f = parseFloat(f);
  return isNaN(f) ? 0 : f;
};

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
      instructions: [],
      steps: [],
      assets: []
    };
  },
  methods: {
    selectInstruction(index) {
      this.steps =
        this.instructions?.length > 0 ? this.instructions[index].steps : null;
    },
    selectStep(index) {
      this.assets = this.steps?.length > 0 ? this.steps[index].assets : null;
    }
  }
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
