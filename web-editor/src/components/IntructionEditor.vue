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
        :index="i"
        :inSlide="s"
        @slide="slides[i]=$event"
        @delete="slides.splice($event, 1)"
        @open="selectedSlide = $event"
        v-for="(s, i) in slides"
      />
    </div>
    <div id="displays">
      <button @click="addDisplay()">Add display</button>
      <DisplayEditor
        :key="i"
        :index="i"
        :inDisplay="dsp"
        @display="currentDisplays[i] = $event"
        @delete="currentDisplays.splice($event, 1)"
        v-for="(dsp, i) in currentDisplays"
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
      selectedSlide: 0
    };
  },
  computed: {
    currentSlide: function() {
      return this.selectedSlide < this.slides.length
        ? this.slides[this.selectedSlide]
        : null;
    },
    currentDisplays: function() {
      return this.currentSlide?.displays;
    }
  },
  methods: {
    updateSlide(slide, value) {
      slide = value;
      console.log("upgrade slide");
    },
    addDisplay() {
      if (this.currentSlide) this.currentDisplays.push(null);
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
