<template>
  <div id="slide" v-if="slide">
    <input id="title" type="text" v-model="slide.title" />
    <textarea id="description" v-model="slide.description" />
    <div id="thumbnail">
      <p>thumbnail URL:</p>
      <input type="text" v-model="slide.thumbnail" />
    </div>
    <div id="actions">
      <button @click="$emit('delete', index)">Remove slide</button>
      <button @click="slide.displays.push(null)">Add display</button>
    </div>
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
          thumbnail: undefined,
          displays: []
        };
      },
      immediate: true
    },
    slide: {
      handler: function(value) {
        this.$emit("slide", value);
        console.log(value);
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
  box-shadow: 0px 5px 10px var(--nord4);
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 300px;
}
#slide > *,
#thumbnail > * {
  margin: 5px 0;
}
#title {
  font-size: 20px;
}
#description {
  height: 150px;
}
#thumbnail {
  display: flex;
  flex-flow: column;
}
#actions {
  display: flex;
  margin-right: -5px;
  margin-left: -5px;
}
#actions > * {
  flex: 1;
  margin: 0 5px;
}
</style>
