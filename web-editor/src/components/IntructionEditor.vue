<template>
  <div id="instruction">
    <p>id: {{uuid}}</p>
    <button @click="slides.push(null)">Add slide</button>
    <div id="slides">
      <SlideEditor
        :key="i"
        :index="i"
        :inSlide="s"
        @slide="slides[i] = $event"
        @delete="slides.splice($event, 1)"
        v-for="(s, i) in slides"
      />
    </div>
  </div>
</template>

<script>
import SlideEditor from "./SlideEditor";

export default {
  name: "InstructionEditor",
  components: {
    SlideEditor
  },
  data() {
    return {
      uuid: this.$uuid.v4(),
      name: "",
      description: "",
      image: null,
      slides: []
    };
  }
};
</script>

<style scoped>
#slides {
  display: flex;
  flex-flow: row;
  width: 100%;
}
</style>
