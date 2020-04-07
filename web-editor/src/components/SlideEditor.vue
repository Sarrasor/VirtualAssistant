<template>
  <div id="slide" v-if="slide">
    <input id="name" type="text" v-model="slide.name" />
    <textarea id="description" v-model="slide.description" />
    <div id="preview">
      <p>thumbnail URL:</p>
      <input type="text" v-model="slide.preview_url" />
    </div>
    <div id="actions">
      <button @click="$emit('delete')">Remove slide</button>
      <button @click="$emit('open')">Edit displays</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlideEditor",
  props: ["inSlide"],
  data() {
    return {
      slide: undefined
    };
  },
  watch: {
    inSlide: {
      handler: function(value) {
        this.slide = value || {
          name: "Slide title",
          description: "Lorem impsum dolor sit amet",
          preview_url: undefined,
          objects: [null]
        };
      },
      immediate: true
    },
    slide: {
      handler: function(value) {
        this.$emit("slide", value);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
#slide {
  margin: 10px;
  box-shadow: 0px 0px 10px var(--nord4);
  padding: 10px;
  display: flex;
  flex-direction: column;
}
#slide > *,
#thumbnail > * {
  margin: 5px 0;
}
#name {
  font-size: 20px;
}
#description {
  height: 150px;
}
#preview {
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
