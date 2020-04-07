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
    <div class="card" style="background-color: #D8DEE9"></div>
  </div>
</template>

<script>
import InstructionEditor from "./components/IntructionEditor";
import SlideEditor from "./components/SlideEditor";
import ObjectEditor from "./components/ObjectEditor";

import Vue from "vue";
import UUID from "vue-uuid";
Vue.use(UUID);

export default {
  name: "App",
  components: {
    InstructionEditor,
    SlideEditor,
    ObjectEditor
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
  gap: 10px;
  background-color: var(--back);
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
.material-icons {
  font-size: 24px;
  pointer-events: none;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--select);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text);
}
</style>
