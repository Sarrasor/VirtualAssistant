<template>
  <div id="app">
    <Instruction
      :instructions="instructions"
      @select="selectInstruction"
      @upload="uploadInstruction"
    />
    <Step :steps="steps" @select="selectStep" />
    <Asset :assets="assets" />
    <Render :assets="assets" :files="files" />
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
      currentInstruction: 0,
      instructions: [],
      files: [],
      steps: [],
      assets: []
    };
  },
  methods: {
    selectInstruction(index) {
      this.currentInstruction = index;
      const instruction =
        this.instructions?.length > 0 ? this.instructions[index] : null;
      this.steps = instruction?.steps;
      this.files = instruction?.files;
    },
    selectStep(index) {
      this.assets = this.steps?.length > 0 ? this.steps[index].assets : null;
    },
    uploadInstruction() {
      let instruction = this.instructions[this.currentInstruction];
      instruction.index.step_count = instruction.steps.length;
      instruction.index.last_modified = Date.now();

      let { steps, files, index } = instruction;
      steps.forEach(s =>
        s.assets
          .filter(a => a.media.url)
          .forEach(
            a => (a.media.type = files.find(f => f.name === a.media.url).type)
          )
      );

      const index_json = JSON.stringify(index);
      const steps_json = JSON.stringify(steps);
      const files_json = JSON.stringify(files);
      console.log(index_json);
      console.log(steps_json);
      console.log(files_json);
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
