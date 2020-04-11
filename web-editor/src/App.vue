<template>
  <div id="app">
    <Instruction
      :instructions="instructions"
      @add="addInstruction"
      @duplicate="duplicateInstruction"
      @delete="deleteInstruction"
      @upload="uploadInstruction"
    />
    <!-- <StepEditor />
    <AssetEditor />-->
    <!-- <StepEditor
      :key="i"
      :inStep="sld"
      @step="$set(steps, i, $event)"
      @delete="steps.splice(i, 1)"
      @open="stepI=i"
      v-for="(sld, i) in steps"
    />-->
    <!-- <AssetEditor
      :key="i"
      :inAsset="obj"
      @asset="$set(step.assets, i, $event)"
      @delete="step.assets.splice(i, 1)"
      @duplicate="step.assets.push(step.assets[i])"
      v-for="(obj, i) in step.assets"
    />-->
    <Render />
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import Instruction from "./components/Instruction";
// import StepEditor from "./components/StepEditor";
// import AssetEditor from "./components/AssetEditor";
import Render from "./components/Render";

export default {
  name: "App",
  components: {
    Instruction,
    // StepEditor,
    // AssetEditor,
    Render
  },
  data() {
    return {
      instructions: []
    };
  },
  methods: {
    addInstruction() {
      this.instructions.push({
        id: uuidv4(),
        name: "Instruction title",
        description: "Lorem impsum dolor sit amet",
        preview_url: undefined,
        steps: []
      });
    },
    deleteInstruction(index) {
      this.instructions.splice(index, 1);
    },
    uploadInstruction(index) {
      console.log(
        "uploading (not yet)",
        JSON.stringify(this.instructions[index])
      );
    },
    duplicateInstruction(index) {
      let duplciate = JSON.parse(JSON.stringify(this.instructions[index]));
      duplciate.name += "(copy)";
      this.instructions.push(duplciate);
    }
  }
};
</script>

<style scoped>
#app {
  width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 200px) 1fr;
}
</style>

<style>
button.flat {
  justify-content: left;
}
button.flat {
  background: transparent;
  border: none;
}
button.flat:hover {
  background-color: var(--select);
}
button.flat.icon {
  width: 40px;
  height: 30px;
  margin: 0;
  place-content: center;
}
.material-icons-outlined {
  font-size: 18px;
  pointer-events: none;
}
.list {
  display: flex;
  flex-wrap: wrap;
  place-content: flex-start;
  overflow-y: auto;
  box-shadow: inset 0 0 5px var(--shadow);
}
.list > * {
  width: 100%;
  border-radius: 0;
  margin: 0;
}
.list > :not(.selected) {
  background-color: transparent;
}
.list > .selected {
  text-decoration: underline;
  background-color: var(--select);
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--select);
  border-radius: 0 4px 4px 0;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text);
}
</style>
