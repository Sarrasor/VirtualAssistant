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

var JSZip = require("jszip");

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
      let { steps, files, index } = instruction;

      index.step_count = steps.length;
      index.last_modified = Date.now();
      steps.forEach(s =>
        s.assets
          .filter(a => a.media.url)
          .forEach(
            a => (a.media.type = files.find(f => f.name === a.media.url).type)
          )
      );

      let zip = new JSZip();
      zip.file(index.id + "/index.json", JSON.stringify(index));
      zip.file(index.id + "/steps.json", JSON.stringify(steps));
      files.forEach(f => {
        zip.file(
          index.id + "/media/" + f.name,
          f.content.substring(f.content.indexOf("base64,") + "base64,".length),
          { base64: true }
        );
      });

      zip
        .generateAsync({
          type: "blob",
          compression: "DEFLATE"
        })
        .then(zip => {
          let req = new XMLHttpRequest();
          req.open("POST", "https://49578e3c.ngrok.io", true);
          req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          req.send(zip);
        });
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
