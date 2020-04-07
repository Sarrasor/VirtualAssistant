<template>
  <div id="editor">
    <div id="assets">
      <div :key="i" v-for="i in 10"></div>
    </div>
    <div id="slides">
      <div id="tools">
        <p>id: {{id}}</p>
        <button @click="slides.push(null)">Add slide</button>
        <input type="file" multiple />
      </div>
      <SlideEditor
        :key="i"
        :inSlide="sld"
        @slide="$set(slides, i, $event)"
        @delete="slides.splice(i, 1)"
        @open="slideI=i"
        v-for="(sld, i) in slides"
      />
    </div>
    <div id="displays" v-if="slide">
      <button @click="slide.objects.push(null)">Add object</button>
      <ObjectEditor
        :key="i"
        :inObject="obj"
        @object="$set(slide.objects, i, $event)"
        @delete="slide.objects.splice(i, 1)"
        @duplicate="slide.objects.push(slide.objects[i])"
        v-for="(obj, i) in slide.objects"
      />
    </div>
    <div id="scene"></div>
  </div>
</template>

<script>
import SlideEditor from "./SlideEditor";
import ObjectEditor from "./ObjectEditor";

export default {
  name: "InstructionEditor",
  components: {
    SlideEditor,
    ObjectEditor
  },
  data() {
    return {
      id: this.$uuid.v4(),
      name: "",
      description: "",
      preview_url: null,
      slides: [null],
      slideI: 0
    };
  },
  computed: {
    slide: function() {
      return this.slideI < this.slides.length ? this.slides[this.slideI] : null;
    }
  }
};
</script>

<style scoped>
#editor {
  width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 100px 300px 200px 1fr;
}
#slides,
#displays {
  margin: 0;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
}
#scene {
  background-color: var(--shadow);
}
#assets {
  margin: 0;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
}
#assets > div {
  background-color: gold;
  width: 90px;
  height: 90px;
  margin: 5px;
}
</style>
