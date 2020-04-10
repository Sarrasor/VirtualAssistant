<template>
  <div id="app">
    <InstructionEditor />
    <StepEditor />
    <AssetEditor />
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
import InstructionEditor from "./components/IntructionEditor";
import StepEditor from "./components/StepEditor";
import AssetEditor from "./components/AssetEditor";
import Render from "./components/Render";

export default {
  name: "App",
  components: {
    InstructionEditor,
    StepEditor,
    AssetEditor,
    Render
  },
  computed: {
    // step: function() {
    //   return this.stepI < this.steps.length ? this.steps[this.stepI] : null;
    // }
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
