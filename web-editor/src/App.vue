<template>
  <div id="app">
    <InstructionEditor />
    <SlideEditor />
    <ObjectEditor />
    <!-- <SlideEditor
      :key="i"
      :inSlide="sld"
      @slide="$set(slides, i, $event)"
      @delete="slides.splice(i, 1)"
      @open="slideI=i"
      v-for="(sld, i) in slides"
    />-->
    <!-- <ObjectEditor
      :key="i"
      :inObject="obj"
      @object="$set(slide.objects, i, $event)"
      @delete="slide.objects.splice(i, 1)"
      @duplicate="slide.objects.push(slide.objects[i])"
      v-for="(obj, i) in slide.objects"
    />-->
    <Render />
  </div>
</template>

<script>
import InstructionEditor from "./components/IntructionEditor";
import SlideEditor from "./components/SlideEditor";
import ObjectEditor from "./components/ObjectEditor";
import Render from "./components/Render";

export default {
  name: "App",
  components: {
    InstructionEditor,
    SlideEditor,
    ObjectEditor,
    Render
  },
  computed: {
    // slide: function() {
    //   return this.slideI < this.slides.length ? this.slides[this.slideI] : null;
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
