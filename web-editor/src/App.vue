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
      loaded: false,
      instructions: [],
      files: [],
      steps: [],
      assets: []
    };
  },
  async mounted() {
    let ids = null;
    await fetch("https://ad0d9c3e.ngrok.io/instructions_list")
      .then(r => r.json())
      .then(j => (ids = j));

    await ids.forEach(id =>
      fetch("https://ad0d9c3e.ngrok.io//instruction?id=" + id)
        .then(r => r.blob())
        .then(b => this.downloadInstructions(b))
    );
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
    downloadInstructions(blob) {
      console.log(blob);
      // let zip = new JSZip();
      // zip.loadAsync(blob);

      // // const regex = /.+?\//g;
      // console.log("blob", blob);
      // console.log("folders", zip.folder(/.+?\//g));
      // console.log("blob", blob);
      // zip.loadAsync(blob);
      // console.log("folders", zip);
      // 1.
      // // this is like Object.values(zip.files) which is not yet implemented everywhere
      // var entries = Object.keys(zip.files).map(function(name) {
      //   return zip.files[name];
      // });

      // // 2.
      // var listOfPromises = entries.map(function(entry) {
      //   return entry.async("uint8array").then(function(u8) {
      //     // we bind the two together to be able to match the name and the content in the last step
      //     return [entry.name, u8];
      //   });
      // });

      // // 3.
      // var promiseOfList = Promise.all(listOfPromises);

      // // 4.
      // promiseOfList.then(function(list) {
      //   // here, list is a list of [name, content]
      //   // let's transform it into an object for easy access
      //   var result = list.reduce(
      //     function(accumulator, current) {
      //       var currentName = current[0];
      //       var currentValue = current[1];
      //       accumulator[currentName] = currentValue;
      //       return accumulator;
      //     },
      //     {} /* initial value */
      //   );

      //   console.log(result);
      // });

      // this.$forceUpdate();
      // this.loaded = true;
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
          req.open("POST", "https://ad0d9c3e.ngrok.io", true);
          req.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
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
