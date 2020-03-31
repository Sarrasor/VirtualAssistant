<template>
  <div id="slide" v-if="slide">
    <input id="title" type="text" v-model="slide.title" />
    <textarea id="description" v-model="slide.description" />
    <button @click="$emit('delete', index)">Remove</button>
    <button @click="slide.displays.push(null)">Add slide</button>
    <DisplayEditor
      :key="i"
      :index="i"
      :inDisplay="dsp"
      @display="slide.displays[i] = $event"
      @delete="slide.displays.splice($event, 1)"
      v-for="(dsp, i) in slide.displays"
    />
  </div>
</template>

<script>
import DisplayEditor from "./DisplayEditor";

export default {
  name: "SlideEditor",
  props: ["index", "inSlide"],
  data() {
    return {
      slide: undefined
    };
  },
  watch: {
    inSlide: {
      handler: function(value) {
        this.slide = value || {
          title: "Slide title",
          description: "Lorem impsum dolor sit amet, dobryi vecher, ya Magomed",
          displays: []
        };
      },
      immediate: true
    },
    slide: {
      handler: function(value) {
        this.$emit("slide", value);
      },
      deep: true
    }
  },
  components: {
    DisplayEditor
  }
};
</script>

<style scoped>
#slide {
  margin: 10px;
  box-shadow: 0px 0px 15px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  width: 300px;
}
#title {
  font-size: 20px;
}
#description {
  height: 150px;
}
</style>
