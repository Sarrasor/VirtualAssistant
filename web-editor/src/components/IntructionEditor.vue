<template>
  <div id="editor">
    <div id="assets">
      <div :key="i" v-for="i in 10"></div>
    </div>
    <div id="slides">
      <div id="tools">
        <p>id: {{uuid}}</p>
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
      <button @click="addDisplay()">Add display</button>
      <DisplayEditor
        :key="i"
        :inDisplay="dsp"
        @display="$set(slide.displays, i, $event)"
        @delete="slide.displays.splice(i, 1)"
        v-for="(dsp, i) in slide.displays"
      />
    </div>
    <div id="scene">
      <img
        src="https://i.ytimg.com/vi/9M5XM7WfVKA/maxresdefault.jpg"
        style="width:100%; height:100%"
        alt
      />
    </div>
  </div>
</template>

<script>
import SlideEditor from "./SlideEditor";
import DisplayEditor from "./DisplayEditor";

export default {
  name: "InstructionEditor",
  components: {
    SlideEditor,
    DisplayEditor
  },
  data() {
    return {
      uuid: this.$uuid.v4(),
      name: "",
      description: "",
      image: null,
      slides: [null],
      slideI: 0
    };
  },
  computed: {
    slide: function() {
      return this.slideI < this.slides.length ? this.slides[this.slideI] : null;
    }
  },
  methods: {
    addDisplay() {
      if (this.slide) this.slide.displays.push(null);
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
#assets {
  margin: 0;
  /* height: 100%; */
  display: flex;
  flex-flow: column;
  overflow-y: auto;
}
#assets > div {
  background-color: var(--nord13);
  width: 90px;
  height: 90px;
  margin: 5px;
}
</style>
