<template>
  <div id="app">
    <Instruction :instructions="instructions" @select="index_in=$event" />
    <Step :steps="steps" @select="index_st=$event" />
    <!-- <Asset /> -->
    <Render />
  </div>
</template>

<script>
import Instruction from "./components/Instruction";
import Step from "./components/Step";
// import Assetfrom "./components/Asset";
import Render from "./components/Render";

export default {
  name: "App",
  components: {
    Instruction,
    Step,
    // Asset,
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
    }
  },
  methods: {}
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
