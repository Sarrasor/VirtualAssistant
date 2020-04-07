<template>
  <div id="slide" v-if="slide">
    <TextArea :label="'name'" @text="slide.name=$event" />
    <TextArea :label="'description'" :multiline="true" @text="slide.description=$event" />
    <FileDrop :label="'preview'" />
  </div>
</template>

<script>
import TextArea from "./TextArea";
import FileDrop from "./FileDrop";

export default {
  name: "SlideEditor",
  props: ["inSlide"],
  components: {
    TextArea,
    FileDrop
  },
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
  box-shadow: 0px 0px 10px var(--shadow);
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: white;
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
